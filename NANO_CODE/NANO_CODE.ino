#include <Wire.h>
int count = 0;
bool dataReceived = false;  // flag to indicate if data has been received
bool sendResponse = false;  // flag to indicate if a response should be sent
String receivedWellId;
float receivedVolume;
int receivedSourceIndex;
bool manualMoveReceived = false;


void setup() {
  Wire.begin(8);                /* join i2c bus with address 8 */
  Wire.onReceive(receiveEvent); /* register receive event */
  Wire.onRequest(requestEvent); /* register request event */
  Serial.begin(9600);           /* start serial for debug */
}

void loop() {
  if (dataReceived) {
    Serial.print("Received well ID: ");
    Serial.println(receivedWellId);
    Serial.print("Received volume: ");
    Serial.println(receivedVolume);
        Serial.print("Received source index: ");
    Serial.println(receivedSourceIndex);

    delay(1000);
    sendResponse = true;     // Set the flag to send the response
    dataReceived = false;    // reset the flag
  } else if(manualMoveReceived) {
    Serial.println("MOVING");
        manualMoveReceived = false; // Reset the flag

  }
  delay(100);
}

void receiveEvent(int howMany) {
  String receivedMessage = "";
  while (0 < Wire.available()) {
    char c = Wire.read();
    if (c == '\0') break; // Stop reading when a null character is encountered
    receivedMessage += c;
  }

  if (receivedMessage.startsWith("manualMove:")) {
    String manualMoveData = receivedMessage.substring(11);
    int separatorIndex = manualMoveData.indexOf(',');
    String axis = manualMoveData.substring(0, separatorIndex);
    float value = manualMoveData.substring(separatorIndex + 1).toFloat();

    // Set the flag and store the axis and value
    manualMoveReceived = true;
    Serial.print("Received manualMove: Axis=");
    Serial.print(axis);
    Serial.print(", Value=");
    Serial.println(value);
  } else {
    int firstDelimiterIndex = receivedMessage.indexOf(',');
    int secondDelimiterIndex = receivedMessage.indexOf(',', firstDelimiterIndex + 1);
    receivedWellId = receivedMessage.substring(0, firstDelimiterIndex);
    receivedVolume = receivedMessage.substring(firstDelimiterIndex + 1, secondDelimiterIndex).toFloat();
    receivedSourceIndex = receivedMessage.substring(secondDelimiterIndex + 1).toInt();

    dataReceived = true;
  }
}



void requestEvent() {
  if (sendResponse) {
    String response = "finished";
    Serial.println("Sending response");
    Wire.write(response.c_str());
    Wire.write('\0'); // Add a null character to indicate the end of the message
    sendResponse = false; // Reset the flag
  }
}
