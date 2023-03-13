#include <EEPROM.h>
#include <ESP8266WiFi.h>

// Define the addresses to read the credentials from EEPROM
const int ssidAddress = 0;
const int passAddress = 32;

WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  delay(10);

  // Read the saved SSID and password from EEPROM
  char ssid[32];
  char password[32];
  EEPROM.begin(512);
  for (int i = 0; i < 32; i++) {
    ssid[i] = EEPROM.read(ssidAddress + i);
    password[i] = EEPROM.read(passAddress + i);
  }
  EEPROM.end();

  // Connect to WiFi network using the saved credentials
  WiFi.begin(ssid, password);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  // Start the server
  server.begin();
  Serial.println("Server started");

  // Print the IP address
  Serial.print("Use this URL to connect: ");
  Serial.print("http://");
  Serial.print(WiFi.localIP());
  Serial.println("/");
}

void loop() {
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Wait until the client sends some data
  Serial.println("New client");
  while(!client.available()){
    delay(1);
  }

  // Read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  // Prepare the HTTP response
  String html = "<html><body>";
  html += "<h1>Press a button</h1>";
  html += "<form>";
  html += "<button name='button' value='1'>Button 1</button>";
  html += "<button name='button' value='2'>Button 2</button>";
  html += "</form>";
  html += "</body></html>";

  // Send the HTTP response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Connection: close");
  client.println("");
  client.println(html);

  // Check if a button was pressed
  if (request.indexOf("/?button=1") != -1) {
    Serial.println("Button 1 pressed");
  }
  if (request.indexOf("/?button=2") != -1) {
    Serial.println("Button 2 pressed");
  }
}
