#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <vector>
#include <Wire.h>
#include <Ticker.h>

#define SDA_PIN 4  // D2 on ESP8266
#define SCL_PIN 5  // D1 on ESP8266

#define ARDUINO_NANO_I2C_ADDR 8

// const char* ssid = "VM6701124_2G";
// const char* password = "fnDdpj9q6qdt";
// const char* ssid = "iPhone (3)";
// const char* password = "13245768";
const char* ssid = "iPhone (58)";
const char* password = "kennyg123";
const int ledPin = LED_BUILTIN;

ESP8266WebServer server(80);
WebSocketsServer webSocket(81);

bool ledState = false;
bool dispensing = false;

struct Well {
  String wellId;
  float volume;
  int sourceIndex;
  int x;
  int y;
};



std::vector<Well> selectedWells;
std::vector<Well>::iterator currentWell;
int currentJobId = -1;  // Initialize to -1 or another value that indicates no jobId has been set


String requestDataFromNano() {
  while (true) {
    Wire.requestFrom(ARDUINO_NANO_I2C_ADDR, 32);
    String response = "";
    while (Wire.available()) {
      char c = Wire.read();
      if (c == '\0') break;
      response += c;
    }

    if (response.startsWith("finished")) {
      Serial.print("Received finished message:");
      Serial.println(response);
      return response;
    }

    else if (response.startsWith("pos:")) {
      Serial.print("Received position message:");
      Serial.println(response);
      return response;
    }

    if (response != "") {
      break;  // Break out of the loop if a non-empty message is received
    }

    delay(100);  // Wait for 100ms before checking again
  }
  return "";
}



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


//proto
void handleDispensing();

void sendI2CMessage(String message) {
  Wire.beginTransmission(ARDUINO_NANO_I2C_ADDR);
  Wire.write(message.c_str());
  Wire.write('\0');  // Add a null character to indicate the end of the message
  Wire.endTransmission();
}

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
      // Parse and remove jobId from the message
      if (message.startsWith("jobId:")) {
        int jobIdEndIndex = message.indexOf(' ');
        String jobIdStr = message.substring(6, jobIdEndIndex);
        int jobId = jobIdStr.toInt();
        Serial.print("Received JobId: ");
        Serial.println(jobId);

        // Update global jobId if jobId is not -1
        if (jobId != -1) {
          currentJobId = jobId;
        }

        // Remove jobId from the message
        message = message.substring(jobIdEndIndex + 1);
      }

      // Serial.print("Job ID: ");
      // Serial.println(currentJobId);
      // Serial.print("Parsed message: ");
      // Serial.println(message);
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
          int xIndex = wellData.indexOf("xCoord:");  // New line
          int yIndex = wellData.indexOf("yCoord:");  // New line


          String wellId = wellData.substring(idIndex + 7, volIndex - 1);
          float volume = wellData.substring(volIndex + 7, srcIndex - 1).toFloat();
          int sourceIndex = wellData.substring(srcIndex + 12, xIndex - 1).toInt();  // Updated line
          int x = wellData.substring(xIndex + 7, yIndex).toInt();
          int y = wellData.substring(yIndex + 7).toInt();  // New line



          selectedWells.push_back({ wellId, volume, sourceIndex, x, y });  // Updated line

          startIndex = nextSeparator + 1;
        }

        // Print the number of selected wells
        Serial.print("Number of selected wells: ");
        Serial.println(selectedWells.size());
        webSocket.broadcastTXT("ready");
        Serial.println("Starting dispensing");
        dispensing = true;
        currentWell = selectedWells.begin();
        handleDispensing();
      }

      else if (message == "startDispensing") {
        Serial.println("Starting dispensing");
        dispensing = true;
        currentWell = selectedWells.begin();
        handleDispensing();
      }

      else if (message.startsWith("manualMove:")) {
        int separatorIndex = message.indexOf(",");
        String axis = message.substring(11, separatorIndex);
        float value = message.substring(separatorIndex + 1).toFloat();
        Serial.print("Received movement message: Axis=");
        Serial.print(axis);
        Serial.print(", Value=");
        Serial.println(value);

        // Add the following lines to send the manualMove information over i2c
        String manualMoveMessage = "manualMove:" + axis + "," + String(value, 2);
        sendI2CMessage(manualMoveMessage);
        String receivedCoordsMessage = "receivedCoords" + requestDataFromNano();

        webSocket.broadcastTXT(receivedCoordsMessage);


      }

            else if (message.startsWith("ZMove:")) {
        int separatorIndex = message.indexOf(",");
        String axis = message.substring(6, separatorIndex);
        float value = message.substring(separatorIndex + 1).toFloat();
        Serial.print("Received movement message: Axis=");
        Serial.print(axis);
        Serial.print(", Value=");
        Serial.println(value);

        // Add the following lines to send the manualMove information over i2c
        String manualMoveMessage = "manualMove:" + axis + "," + String(value, 2);
        sendI2CMessage(manualMoveMessage);
        String receivedCoordsMessage = "ZMoved" + requestDataFromNano() + " jobId:" + String(currentJobId);

        webSocket.broadcastTXT(receivedCoordsMessage);


      }

      else if (message.startsWith("clickPipette:")) {
        int separatorIndex = message.indexOf(",");
        String axis = message.substring(13, separatorIndex);
        float value = message.substring(separatorIndex + 1).toFloat();
        Serial.print("Received movement message: Axis=");
        Serial.print(axis);
        Serial.print(", Value=");
        Serial.println(value);

        // Add the following lines to send the manualMove information over i2c
        String manualMoveMessage = "manualMove:" + axis + "," + String(value, 2);
        sendI2CMessage(manualMoveMessage);
        String pipMessage = "pipettedClicked" + requestDataFromNano() + " jobId:" + String(currentJobId);

        webSocket.broadcastTXT(pipMessage);


      }


      else if (message.startsWith("manualCoords:")) {
        int separatorIndex1 = message.indexOf(',');
        int separatorIndex2 = message.indexOf(',', separatorIndex1 + 1);

        String coordX = message.substring(13, separatorIndex1);
        String coordY = message.substring(separatorIndex1 + 1, separatorIndex2);
        String coordZ = message.substring(separatorIndex2 + 1);

        Serial.print("Received coords: X=");
        Serial.print(coordX);
        Serial.print(", Y=");
        Serial.print(coordY);
        Serial.print(", Z=");
        Serial.println(coordZ);


        // Send the coordinates over i2c
        String manualCoordsMessage = "manualCoords:" + coordX + "," + coordY + "," + coordZ;
        sendI2CMessage(manualCoordsMessage);
        String receivedCoordsMessage = "receivedCoords" + requestDataFromNano() + " jobId:" + String(currentJobId);
        Serial.print("Sending coords message: ");
        Serial.println(receivedCoordsMessage);
        webSocket.broadcastTXT(receivedCoordsMessage);

      }

      else if (message.startsWith("moveToLimit:")) {
        String axis = message.substring(12);
        Serial.print("Received moveToLimit message: Axis=");
        Serial.println(axis);

        // Add the following lines to send the moveToLimit information over i2c
        String moveToLimitMessage = "moveToLimit:" + axis;
        sendI2CMessage(moveToLimitMessage);

        String receivedCoordsMessage = "receivedCoords" + requestDataFromNano();

        webSocket.broadcastTXT(receivedCoordsMessage);

      }

      else if (message == "resetCounter") {
        String resetCounterMessage = "resetCounter";
        sendI2CMessage(resetCounterMessage);
      }

      else if (message == "getCurrentCoords") {
        String getCoordsMessage = "getCurrentCoords";
        sendI2CMessage(getCoordsMessage);
        String receivedCoordsMessage = "receivedCoords" + requestDataFromNano();

        webSocket.broadcastTXT(receivedCoordsMessage);
      }

      else if (message == "setHome") {
        String setHomeMessage = "setHome";
        sendI2CMessage(setHomeMessage);
      }

      else if (message == "emergencyStop") {
        Serial.println("Emergency Stop");
        dispensing = false;
        digitalWrite(LED_BUILTIN, LOW);
        webSocket.broadcastTXT("stopped");
      }

      break;
  }
}

void handleDispensing() {
  while (currentWell != selectedWells.end()) {
    Serial.println("Current Well Data:");
    Serial.print("wellId: ");
    Serial.println(currentWell->wellId);
    Serial.print("volume: ");
    Serial.println(currentWell->volume, 2);
    Serial.print("sourceIndex: ");
    Serial.println(currentWell->sourceIndex);
    Serial.print("x: ");
    Serial.println(currentWell->x);
    Serial.print("y: ");
    Serial.println(currentWell->y);

    String wellDataToSend = currentWell->wellId + "," + String(currentWell->volume, 2) + "," + String(currentWell->sourceIndex) + "," + String(currentWell->x) + "," + String(currentWell->y);
    Serial.print("String wellDataToSend = ");
    Serial.println(wellDataToSend);

    String message = "dispensingWell:" + currentWell->wellId;
    webSocket.broadcastTXT(message);

    Wire.beginTransmission(ARDUINO_NANO_I2C_ADDR);
    Serial.print("Sending i2c message: ");
    Serial.println(wellDataToSend);
    sendI2CMessage(wellDataToSend);

    // Wait for well to finish
    String wellFinishedResponse;
    wellFinishedResponse = requestDataFromNano();

    // Process the well finished message
    String receivedWellId = wellFinishedResponse.substring(9);
    Serial.print("Received well ID: ");
    Serial.println(receivedWellId);

    String completedWellMessage = "completedWell:" + currentWell->wellId;
    String wellCoordsMessage = "receivedCoords" + String("pos:X=") + String(currentWell->x) + ",Y=" + String(currentWell->y) + ",Z=0,PIP=0";
    // update this to include z and pip
    webSocket.broadcastTXT(completedWellMessage);
    webSocket.broadcastTXT(wellCoordsMessage);


    // Reset the flag

    // Move on to the next well
    ++currentWell;
  }

  if (currentWell == selectedWells.end()) {
    // All wells have been dispensed
    Serial.println("Dispensing finished");
    dispensing = false;
    String dispenseFinishedMessage = "dispensefinished:" + String(currentJobId);
    webSocket.broadcastTXT(dispenseFinishedMessage);
  }
}



void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  // Call either connectToWiFi() or createAccessPoint() here based on your requirement
  connectToWiFi();
  // createAccessPoint();

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
