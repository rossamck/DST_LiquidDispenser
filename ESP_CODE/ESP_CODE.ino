#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <vector>
#include <Wire.h>
#include <Ticker.h>
#include <ArduinoJson.h>

#define SDA_PIN 4  // D2 on ESP8266
#define SCL_PIN 5  // D1 on ESP8266

#define ARDUINO_NANO_I2C_ADDR 8

const char* ssid = "VM6701124_2G";
const char* password = "fnDdpj9q6qdt";
// const char* ssid = "iPhone (3)";
// const char* password = "13245768";
const int ledPin = LED_BUILTIN;

ESP8266WebServer server(80);
WebSocketsServer webSocket(81);

bool ledState = false;
bool dispensing = false;

struct Well {
  String wellId;
  float volume;
  int sourceIndex;
};


std::vector<Well> selectedWells;
std::vector<Well>::iterator currentWell;

Ticker dispenseTicker;

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void createAccessPoint() {
  Serial.println("Creating access point...");
  WiFi.mode(WIFI_AP);
  IPAddress localIP(192, 168, 4, 1);
  IPAddress gateway(192, 168, 4, 1);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.softAPConfig(localIP, gateway, subnet);
  WiFi.softAP("ESP8266AP", "password");

  Serial.println("");
  Serial.println("Access Point created");
  Serial.println("IP address: ");
  Serial.println(WiFi.softAPIP());
}

void handleDispensing();



void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;

    case WStype_CONNECTED:
      Serial.printf("[%u] Connected from %s\n", num, server.client().remoteIP().toString().c_str());
      break;

    case WStype_TEXT:
      String message = String((char*)payload);
      if (message == "ping") {
        webSocket.sendTXT(num, "pong");
        break;
      }
      Serial.printf("[%u] Received: %s\n", num, payload);

      if (message == "toggleLED") {
        ledState = !ledState;
        digitalWrite(ledPin, ledState ? LOW : HIGH);

      } else if (message.startsWith("selectWells:")) {
        selectedWells.clear();
        String wellsData = message.substring(12);
        Serial.println("Processing wells data: " + wellsData);

        wellsData.replace("},{", "};{");
        int startIndex = 0;
        int endIndex = wellsData.length();

        while (startIndex < endIndex) {
          int nextSeparator = wellsData.indexOf(';', startIndex);
          if (nextSeparator == -1) {
            nextSeparator = endIndex;
          }

          String wellData = wellsData.substring(startIndex + 1, nextSeparator - 1);
          wellData.replace("\"", "");
          wellData.replace("}", "");
          wellData.replace("{", "");

          int idIndex = wellData.indexOf("wellId:");
          int volIndex = wellData.indexOf("volume:");
          int srcIndex = wellData.indexOf("sourceIndex:");

          String wellId = wellData.substring(idIndex + 7, volIndex - 1);
          float volume = wellData.substring(volIndex + 7, srcIndex - 1).toFloat();
          int sourceIndex = wellData.substring(srcIndex + 12).toInt();

          selectedWells.push_back({ wellId, volume, sourceIndex });

          startIndex = nextSeparator + 1;
        }

        // Print the number of selected wells
        Serial.print("Number of selected wells: ");
        Serial.println(selectedWells.size());
        webSocket.broadcastTXT("ready");
      }

      else if (message == "startDispensing") {
        Serial.println("Starting dispensing");
        dispensing = true;
        currentWell = selectedWells.begin();
        dispenseTicker.attach_ms(100, handleDispensing);

      } else if (message.startsWith("manualMove:")) {
        int separatorIndex = message.indexOf(",");
        String axis = message.substring(11, separatorIndex);
        float value = message.substring(separatorIndex + 1).toFloat();
        Serial.print("Received movement message: Axis=");
        Serial.print(axis);
        Serial.print(", Value=");
        Serial.println(value);

        // Add the following lines to send the manualMove information over i2c
        String manualMoveMessage = "manualMove:" + axis + "," + String(value, 2);
        Wire.beginTransmission(ARDUINO_NANO_I2C_ADDR);
        Wire.write(manualMoveMessage.c_str());
        Wire.write('\0');  // Add a null character to indicate the end of the message
        Wire.endTransmission();
      }

  else if (message.startsWith("manualCoords:")) {
    int separatorIndex = message.indexOf(',');
    String coordX = message.substring(13, separatorIndex);
    String coordY = message.substring(separatorIndex + 1);
    Serial.print("Received coords: X=");
    Serial.print(coordX);
    Serial.print(", Y=");
    Serial.println(coordY);

    // Send the coordinates over i2c
    String manualCoordsMessage = "manualCoords:" + coordX + "," + coordY;
    Wire.beginTransmission(ARDUINO_NANO_I2C_ADDR);
    Wire.write(manualCoordsMessage.c_str());
    Wire.write('\0');  // Add a null character to indicate the end of the message
    Wire.endTransmission();
  }




      else if (message.startsWith("moveToLimit:")) {
  String axis = message.substring(12);
  Serial.print("Received moveToLimit message: Axis=");
  Serial.println(axis);

  // Add the following lines to send the moveToLimit information over i2c
  String moveToLimitMessage = "moveToLimit:" + axis;
  Wire.beginTransmission(ARDUINO_NANO_I2C_ADDR);
  Wire.write(moveToLimitMessage.c_str());
  Wire.write('\0');  // Add a null character to indicate the end of the message
  Wire.endTransmission();
}

      else if (message == "emergencyStop") {
        Serial.println("Emergency Stop");
        dispensing = false;
        digitalWrite(LED_BUILTIN, LOW);
        webSocket.broadcastTXT("stopped");
        dispenseTicker.detach();
      }

      break;
  }
}

void handleDispensing() {
  if (!dispensing || currentWell == selectedWells.end()) {
    dispenseTicker.detach();
    return;
  }

  String wellIdAndVolume = currentWell->wellId + "," + String(currentWell->volume, 2) + "," + String(currentWell->sourceIndex);
  Serial.print("String wellIdAndVolume = ");
  Serial.println(wellIdAndVolume);

  String message = "dispensingWell:" + currentWell->wellId;
  webSocket.broadcastTXT(message);

  Wire.beginTransmission(ARDUINO_NANO_I2C_ADDR);
  Wire.write(wellIdAndVolume.c_str());
  Wire.write('\0');  // Add a null character to indicate the end of the message
  Wire.endTransmission();

  Wire.requestFrom(ARDUINO_NANO_I2C_ADDR, 32);  // Request up to 32 characters (adjust as needed)
  String response = "";
  while (Wire.available()) {
    char c = Wire.read();
    if (c == '\0') break;  // Stop reading when a null character is encountered
    response += c;
  }
  Serial.println(response);

  if (response == "finished") {
    String completedWellMessage = "completedWell:" + currentWell->wellId;
    webSocket.broadcastTXT(completedWellMessage);

    // Move on to the next well
    ++currentWell;

    if (currentWell == selectedWells.end()) {
      // All wells have been dispensed
      Serial.println("Dispensing finished");
      dispensing = false;
      webSocket.broadcastTXT("dispensefinished");
      dispenseTicker.detach();
    }
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  // Call either connectToWiFi() or createAccessPoint() here based on your requirement
  connectToWiFi();
  //  createAccessPoint();

  server.begin();
  server.on("/socket.io/", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  Wire.begin(SDA_PIN, SCL_PIN);
}

void loop() {
  webSocket.loop();
}
