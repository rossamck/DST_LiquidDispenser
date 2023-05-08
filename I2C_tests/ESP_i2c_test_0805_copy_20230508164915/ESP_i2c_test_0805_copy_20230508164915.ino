#include <Wire.h>

#define SDA_PIN 4 // D2 on ESP8266
#define SCL_PIN 5 // D1 on ESP8266

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);
}

void loop() {
  Wire.beginTransmission(8); // Address of Arduino Nano
  Wire.write("Hello");
  Wire.endTransmission();
  Serial.println("Sent: Hello");

  delay(1000); // Wait for a second

  Wire.requestFrom(8, 6); // Request 6 bytes from Nano

  String received = "";
  while (Wire.available()) {
    char c = Wire.read();
    received += c;
  }

  if (received.length() > 0) {
    Serial.print("Received: ");
    Serial.println(received);
  }

  delay(1000);
}
