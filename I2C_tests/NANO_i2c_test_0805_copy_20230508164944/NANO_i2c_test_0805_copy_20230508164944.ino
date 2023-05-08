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
  String received = "";
  while (Wire.available()) {
    char c = Wire.read();
    received += c;
  }

  if (received.length() > 0) {
    Serial.print("Received: ");
    Serial.println(received);
  }
}

void requestEvent() {
  Wire.write("Reply");
  Serial.println("Sent: Reply");
}
