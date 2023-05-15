#include <Wire.h>
#include <AccelStepper.h>
#include <MultiStepperMotor.h>

// I2C-related definitions
#define SDA_PIN A4
#define SCL_PIN A5

// Stepper motor pin definitions
#define X_DIR_PIN 2
#define X_STEP_PIN 3
#define Y_DIR_PIN 4
#define Y_STEP_PIN 5
#define Z_DIR_PIN 7
#define Z_STEP_PIN 6
#define PIP_DIR_PIN 8
#define PIP_STEP_PIN 9

#define ENABLE 4  // unused

// Microstepping pin definitions
#define M0_PIN 11
#define M1_PIN 12
#define M2_PIN 13

// Limit switch pin definitions
#define LIMIT_1 A0
#define LIMIT_2 A1
#define LIMIT_3 A2
#define LIMIT_4 A3

// Stepper motor objects  
SingleStepper stepper_X(X_STEP_PIN, X_DIR_PIN, LIMIT_1, true); // Pass true to invert the direction
SingleStepper stepper_Y(Y_STEP_PIN, Y_DIR_PIN, LIMIT_2);
SingleStepper stepper_Z(Z_STEP_PIN, Z_DIR_PIN, LIMIT_3);
SingleStepper stepper_PIP(PIP_STEP_PIN, PIP_DIR_PIN, LIMIT_4, true);
MultiStepper multiStepper(stepper_X, stepper_Y);

struct ReceivedData {
  bool dataReceived = false;
  bool sendResponse = false;
  bool manualMoveReceived = false;
  String wellId;
  float volume;
  int sourceIndex;

  bool sendCoords = false;
  String axis;
  float value;

  bool moveToLimitReceived = false;
  String moveToLimitAxis;

  bool manualCoordsReceived = false;
  String coordX;
  String coordY;
  String coordZ;

  bool setHomeReceived = false;
} receivedData;

float previousX = 0;
float previousY = 0;
float previousZ = 0;
float previousPIP = 0;

int microstep_amount = 8;
int fullturn_400 = 400 * microstep_amount;
int fullturn_200 = 200 * microstep_amount;

void getCurrentPositions(long& xCurrentPosition, long& yCurrentPosition, long& zCurrentPosition, long& pipCurrentPosition) {
  xCurrentPosition = stepper_X.currentPosition() / microstep_amount;
  yCurrentPosition = stepper_Y.currentPosition() / microstep_amount;
  zCurrentPosition = stepper_Z.currentPosition() / microstep_amount;
  pipCurrentPosition = stepper_PIP.currentPosition() / microstep_amount;
}

void sendPositions(const long xCurrentPosition, const long yCurrentPosition, const long zCurrentPosition, const long pipCurrentPosition) {
  Wire.write("pos:");
  Wire.write("X=");
  Wire.write(String(xCurrentPosition).c_str());
  Wire.write(",");
  Wire.write("Y=");
  Wire.write(String(yCurrentPosition).c_str());
  Wire.write(",");
  Wire.write("Z=");
  Wire.write(String(zCurrentPosition).c_str());
  Wire.write(",");
  Wire.write("PIP=");
  Wire.write(String(pipCurrentPosition).c_str());
  Wire.write('\0');  // Add a null character to indicate the end of the message
}

void sendCurrentPositions() {
  long xCurrentPosition, yCurrentPosition, zCurrentPosition, pipCurrentPosition;
  getCurrentPositions(xCurrentPosition, yCurrentPosition, zCurrentPosition, pipCurrentPosition);
  sendPositions(xCurrentPosition, yCurrentPosition, zCurrentPosition, pipCurrentPosition);
}


void moveMotors(float currentX, float currentY, float currentZ) {
    float deltaX = currentX - previousX;
    float deltaY = currentY - previousY;
    float deltaZ = currentZ - previousZ;

    long stepsX = deltaX * microstep_amount;
    long stepsY = deltaY * microstep_amount;
    long stepsZ = deltaZ * microstep_amount;

    Serial.print("deltaX=");
    Serial.print(deltaX);
    Serial.print(", deltaY=");
    Serial.print(deltaY);
    Serial.print(", deltaZ=");
    Serial.print(deltaZ);
    
    multiStepper.move(stepsX, stepsY);
    multiStepper.runToPosition();

    previousX = currentX;
    previousY = currentY;
    previousZ = currentZ;

}

void setup() {
  // I2C setup
  Wire.begin(8);
  Wire.onReceive(receiveEvent);
  Wire.onRequest(requestEvent);
  Serial.begin(9600);
  Serial.println("Starting Nano");

  //   pinMode(SDA_PIN, INPUT_PULLUP);
  // pinMode(SCL_PIN, INPUT_PULLUP);

  // Stepper motor setup
  pinMode(M0_PIN, OUTPUT);
  pinMode(M1_PIN, OUTPUT);
  pinMode(M2_PIN, OUTPUT);
  pinMode(ENABLE, OUTPUT);
  digitalWrite(M0_PIN, HIGH);
  digitalWrite(M1_PIN, HIGH);
  digitalWrite(M2_PIN, LOW);
  multiStepper.setMaxSpeed(10000, 10000);
  multiStepper.setAcceleration(2000, 2000);
  stepper_Z.setMaxSpeed(10000);
  stepper_Z.setAcceleration(2000);
  stepper_PIP.setMaxSpeed(10000);
  stepper_PIP.setAcceleration(2000);

  //Limit switch setup
  pinMode(LIMIT_1, INPUT_PULLUP);
  pinMode(LIMIT_2, INPUT_PULLUP);
    pinMode(LIMIT_3, INPUT_PULLUP);
  pinMode(LIMIT_4, INPUT_PULLUP);
}

void loop() {


  int switchState1 = digitalRead(LIMIT_1);
    int switchState2 = digitalRead(LIMIT_2);

  int switchState3 = digitalRead(LIMIT_3);

  int switchState4 = digitalRead(LIMIT_4);


  // Check if the switch is closed
  if (switchState1 == LOW) {
    Serial.println("Switch 1 is closed");
    delay(500);  // Add a short delay to avoid flooding the serial monitor with messages
  }

    if (switchState2 == LOW) {
    Serial.println("Switch 2 is closed");
    delay(500);  // Add a short delay to avoid flooding the serial monitor with messages
  }

    if (switchState3 == LOW) {
    Serial.println("Switch 3 is closed");
    delay(500);  // Add a short delay to avoid flooding the serial monitor with messages
  }

    if (switchState4 == LOW) {
    Serial.println("Switch 4 is closed");
    delay(500);  // Add a short delay to avoid flooding the serial monitor with messages
  }

  if (receivedData.dataReceived) {
    Serial.print("Received well ID: ");
    Serial.println(receivedData.wellId);
    Serial.print("Received volume: ");
    Serial.println(receivedData.volume);
    Serial.print("Received source index: ");
    Serial.println(receivedData.sourceIndex);
    Serial.print("Received x: ");
    Serial.println(receivedData.coordX);
    Serial.print("Received y: ");
    Serial.println(receivedData.coordY);

    float currentX = receivedData.coordX.toFloat();
    float currentY = receivedData.coordY.toFloat();
        float currentZ = receivedData.coordZ.toFloat();


    moveMotors(currentX, currentY, currentZ);

        delay(1000); //replace this with function to dispense
    Serial.print("Send well response for: ");
        Serial.println(receivedData.wellId);


    receivedData.sendResponse = true;
    receivedData.dataReceived = false;

  } 
  
  else if (receivedData.manualMoveReceived) { 
    Serial.print("Received Data: ");
    Serial.print("Axis = ");
    Serial.print(receivedData.axis);
    Serial.print(", Value = ");
    Serial.println(receivedData.value);

    if (receivedData.axis == "X") {
      float deltaX = receivedData.value - previousX;
      stepper_X.move(deltaX * microstep_amount);  // Move by deltaX number of microsteps
      stepper_X.runToPosition();
      previousX = receivedData.value;
    } else if (receivedData.axis == "Y") {
      float deltaY = receivedData.value - previousY;
      stepper_Y.move(deltaY * microstep_amount);  // Move by deltaY number of microsteps
      stepper_Y.runToPosition();
      previousY = receivedData.value;
    } else if (receivedData.axis == "Z") {
      float deltaZ = receivedData.value - previousZ;
      Serial.print("DeltaZ = ");
      Serial.println(deltaZ);
      stepper_Z.move(deltaZ * microstep_amount);  // Move by deltaZ number of microsteps
      stepper_Z.runToPosition();
      previousZ = receivedData.value;
    } else if (receivedData.axis == "PIP") {
      float deltaPIP = receivedData.value - previousPIP;
      stepper_PIP.move(deltaPIP * microstep_amount);  // Move by deltaPIP number of microsteps
      stepper_PIP.runToPosition();
      previousPIP = receivedData.value;
    }
      // Check current motor positions:
    long xCurrentPosition = stepper_X.currentPosition();
    long yCurrentPosition = stepper_Y.currentPosition();
    long zCurrentPosition = stepper_Z.currentPosition();
    long pipCurrentPosition = stepper_PIP.currentPosition();
    Serial.print("X current position: ");
    Serial.println(xCurrentPosition);
    Serial.print("Y current position: ");
    Serial.println(yCurrentPosition);
    Serial.print("Z current position: ");
    Serial.println(zCurrentPosition);
    Serial.print("PIP current position: ");
    Serial.println(pipCurrentPosition);
        sendCurrentPositions();
    receivedData.sendCoords = true;
    receivedData.manualMoveReceived = false;



  } 
  
  else if (receivedData.moveToLimitReceived) {
    if (receivedData.moveToLimitAxis == "X") {
      stepper_X.runToLimit();
    } else if (receivedData.moveToLimitAxis == "Y") {
      stepper_Y.runToLimit();
    } else if (receivedData.moveToLimitAxis == "Z") {
      stepper_Z.runToLimit();
    } 
    receivedData.moveToLimitReceived = false;
  } 
  
  else if (receivedData.manualCoordsReceived) {
    float currentX = receivedData.coordX.toFloat();
    float currentY = receivedData.coordY.toFloat();
    float currentZ = receivedData.coordZ.toFloat();

    moveMotors(currentX, currentY, currentZ); // And also here


    receivedData.sendCoords = true;
    receivedData.manualCoordsReceived = false;
  }

  else if (receivedData.setHomeReceived) {
    Serial.println("Setting home position!");
    stepper_X.setCurrentPosition(0);
    stepper_Y.setCurrentPosition(0);
    stepper_Z.setCurrentPosition(0);
    stepper_PIP.setCurrentPosition(0);

    receivedData.setHomeReceived = false;
  }

// Serial.print("send status = ");
// Serial.println(receivedData.sendResponse);
  delay(100);
}

void receiveEvent(int howMany) {
  String receivedMessage = "";
  while (0 < Wire.available()) {
    char c = Wire.read();
    if (c == '\0') break;
    receivedMessage += c;
  }

  if (receivedMessage.startsWith("manualMove:")) {
    String manualMoveData = receivedMessage.substring(11);
    int separatorIndex = manualMoveData.indexOf(',');
    receivedData.axis = manualMoveData.substring(0, separatorIndex);
    receivedData.value = manualMoveData.substring(separatorIndex + 1).toFloat();

    receivedData.manualMoveReceived = true;
    Serial.print("Received manualMove: Axis=");
    Serial.print(receivedData.axis);
    Serial.print(", Value=");
    Serial.println(receivedData.value);
  } 

  else if (receivedMessage.startsWith("moveToLimit:")) {
    receivedData.moveToLimitAxis = receivedMessage.substring(12);
    receivedData.moveToLimitReceived = true;
    Serial.print("Received moveToLimit: Axis=");
    Serial.println(receivedData.moveToLimitAxis);
  }

  else if (receivedMessage.startsWith("manualCoords:")) {
    String manualCoordsData = receivedMessage.substring(13);
int separatorIndex1 = manualCoordsData.indexOf(',');
int separatorIndex2 = manualCoordsData.indexOf(',', separatorIndex1 + 1);
String xCoord = manualCoordsData.substring(0, separatorIndex1);
String yCoord = manualCoordsData.substring(separatorIndex1 + 1, separatorIndex2);
String zCoord = manualCoordsData.substring(separatorIndex2 + 1);


    // Extract the numerical part of the coordinates
receivedData.coordX = xCoord.substring(xCoord.indexOf('=') + 1);
receivedData.coordY = yCoord.substring(yCoord.indexOf('=') + 1);
receivedData.coordZ = zCoord.substring(zCoord.indexOf('=') + 1);


    // Set the flag and store the coordinates
receivedData.manualCoordsReceived = true;
Serial.print("Received manualCoords: X=");
Serial.print(receivedData.coordX);
Serial.print(", Y=");
Serial.print(receivedData.coordY);
Serial.print(", Z=");
Serial.println(receivedData.coordZ);

  }

  else if (receivedMessage.startsWith("getCurrentCoords")) {
    receivedData.sendCoords = true;

  }

  else if (receivedMessage.startsWith("setHome")) {
    receivedData.setHomeReceived = true;
  }

  else if (receivedMessage.startsWith("resetCounter")) {
    Serial.println("RESET");
  }

else {
  int firstDelimiterIndex = receivedMessage.indexOf(',');
  int secondDelimiterIndex = receivedMessage.indexOf(',', firstDelimiterIndex + 1);
  int thirdDelimiterIndex = receivedMessage.indexOf(',', secondDelimiterIndex + 1);
  int fourthDelimiterIndex = receivedMessage.indexOf(',', thirdDelimiterIndex + 1);

  receivedData.wellId = receivedMessage.substring(0, firstDelimiterIndex);
  receivedData.volume = receivedMessage.substring(firstDelimiterIndex + 1, secondDelimiterIndex).toFloat();
  receivedData.sourceIndex = receivedMessage.substring(secondDelimiterIndex + 1, thirdDelimiterIndex).toInt();
  receivedData.coordX = receivedMessage.substring(thirdDelimiterIndex + 1, fourthDelimiterIndex).toFloat();
  receivedData.coordY = receivedMessage.substring(fourthDelimiterIndex + 1).toFloat();

  receivedData.dataReceived = true;
}

}

void requestEvent() {
  if (receivedData.sendResponse) {
    String response = "finished " + receivedData.wellId;
    Serial.print("Sending response for: ");
    Serial.println(receivedData.wellId);
    Wire.write(response.c_str());
    receivedData.sendResponse = false;  // Reset the flag
  } else if (receivedData.sendCoords) {
    Serial.println("Sending current positions");
    sendCurrentPositions();
    receivedData.sendCoords = false;  // Reset the flag
  } else {
    Wire.write('\0');  // No data to send, just send a null character
  }
}

  


