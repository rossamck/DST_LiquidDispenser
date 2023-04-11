#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>


const char* ssid = "VM6701124_2G";
const char* password = "fnDdpj9q6qdt";

const int ledPin = LED_BUILTIN;

ESP8266WebServer server(80);
WebSocketsServer webSocket(81);

bool ledState = false;

void updateClients() {
  String stateStr = ledState ? "on" : "off";
  webSocket.broadcastTXT("LED:" + stateStr);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;

    case WStype_CONNECTED:
      Serial.printf("[%u] Connected from %s\n", num, server.client().remoteIP().toString().c_str());
      // updateClients(); // Update new client with current LED state
      break;

    case WStype_TEXT:
      Serial.printf("[%u] Received: %s\n", num, payload);
      String message = String((char*)payload);

      if (message == "toggleLED") {
        ledState = !ledState;
        digitalWrite(ledPin, ledState ? LOW : HIGH);
        // updateClients(); // Update all clients with new LED state

      } else if (message.startsWith("selectWells:")) {
        String wellsData = message.substring(12);
        Serial.println("Processing wells data: " + wellsData);

        // Prepare the JSON buffer
        DynamicJsonDocument doc(2048);

        // Parse the JSON array
        DeserializationError error = deserializeJson(doc, wellsData);
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
          return;
        }

        JsonArray selectedWells = doc.as<JsonArray>();

        // Print the number of selected wells
        Serial.print("Number of selected wells: ");
        Serial.println(selectedWells.size());
        delay(2000);  // Simulate processing time

        // Iterate through the selected wells and parse the well ID and volume
        for (JsonObject elem : selectedWells) {
          const char* wellId = elem["wellId"];
          float volume = elem["volume"];
          Serial.print("Well ID: ");
          Serial.print(wellId);
          Serial.print(", Volume: ");
          Serial.println(volume, 2);
        }

        // Update coordinates list and send to nano
        webSocket.broadcastTXT("ready");
      } else if (message == "startDispensing") {
        Serial.println("Starting dispensing");
        // Add dispensing code here
        delay(1000);
        Serial.println("Dispensing finished");
        webSocket.broadcastTXT("dispensefinished");

      } else if (message == "ping") {
        webSocket.sendTXT(num, "pong");
      }
      break;
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, HIGH);

  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  server.begin();
  server.on("/socket.io/", HTTP_OPTIONS, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(200, "text/plain", "");
  });

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}
