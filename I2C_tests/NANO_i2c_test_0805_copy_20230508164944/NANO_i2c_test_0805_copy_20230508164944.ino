#include <Wire.h>

#define SDA_PIN A4
#define SCL_PIN A5

void setup() {
  Serial.begin(9600);
  Wire.begin(8); // Set the address of the Nano
  Wire.onReceive(receiveEvent);
  Wire.onRequest(requestEvent);
  pinMode(SDA_PIN, INPUT_PULLUP);
  pinMode(SCL_PIN, INPUT_PULLUP);
}

void loop() {
  delay(100);
}

void receiveEvent(int bytes) {
  while (Wire.available()) {
    char c = Wire.read();
    Serial.print("Received: ");
    Serial.println(c);
  }
}

void requestEvent() {
  Wire.write("Reply");
  Serial.println("Sent: Reply");
}
