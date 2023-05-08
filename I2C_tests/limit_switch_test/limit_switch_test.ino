const int switchPin = A0;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);

  // Set the switch pin as an input with the internal pull-up resistor enabled
  pinMode(switchPin, INPUT_PULLUP);
}

void loop() {
  // Read the state of the switch
  int switchState = digitalRead(switchPin);

  // Check if the switch is closed
  if (switchState == LOW) {
    Serial.println("Switch is closed");
    delay(500); // Add a short delay to avoid flooding the serial monitor with messages
  }
}
