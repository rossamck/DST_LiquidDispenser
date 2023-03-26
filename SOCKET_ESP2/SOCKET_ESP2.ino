#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <WebSocketsServer.h>

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

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;

    case WStype_CONNECTED:
      Serial.printf("[%u] Connected from %s\n", num, server.client().remoteIP().toString().c_str());
      updateClients(); // Update new client with current LED state
      break;

    case WStype_TEXT:
      Serial.printf("[%u] Received: %s\n", num, payload);
      String message = String((char*) payload);

      if (message == "toggleLED") {
        ledState = !ledState;
        digitalWrite(ledPin, ledState ? LOW : HIGH);
        updateClients(); // Update all clients with new LED state
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
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}
