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
#define LIMIT_3 A3

// Stepper motor objects
MultiStepperMotor stepper_X(X_STEP_PIN, X_DIR_PIN, LIMIT_1);
MultiStepperMotor stepper_Y(Y_STEP_PIN, Y_DIR_PIN, LIMIT_2);
MultiStepperMotor stepper_Z(Z_STEP_PIN, Z_DIR_PIN);
MultiStepperMotor stepper_PIP(PIP_STEP_PIN, PIP_DIR_PIN);
MultiStepperXY multiStepper(stepper_X, stepper_Y);

struct ReceivedData {
  bool dataReceived = false;
  bool sendResponse = false;
  bool manualMoveReceived = false;
  String wellId;
  float volume;
  int sourceIndex;

  String axis;
  float value;

  bool moveToLimitReceived = false;
  String moveToLimitAxis;

  bool manualCoordsReceived = false;
  String coordX;
  String coordY;

  bool setHomeReceived = false;
} receivedData;

float previousX = 0;
float previousY = 0;
float previousZ = 0;
float previousPIP = 0;

int microstep_amount = 8;
int fullturn_400 = 400 * microstep_amount;
int fullturn_200 = 200 * microstep_amount;

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
  multiStepper.setMaxSpeed(10000);
  multiStepper.setAcceleration(2000);
  stepper_Z.setMaxSpeed(10000);
  stepper_Z.setAcceleration(2000);
  stepper_PIP.setMaxSpeed(10000);
  stepper_PIP.setAcceleration(2000);

  //Limit switch setup
  pinMode(LIMIT_1, INPUT_PULLUP);
  pinMode(LIMIT_2, INPUT_PULLUP);
}

void loop() {


  int switchState = digitalRead(LIMIT_1);

  // Check if the switch is closed
  if (switchState == LOW) {
    Serial.println("Switch is closed");
    delay(500);  // Add a short delay to avoid flooding the serial monitor with messages
  }

  if (receivedData.dataReceived) {
    Serial.print("Received well ID: ");
    Serial.println(receivedData.wellId);
    Serial.print("Received volume: ");
    Serial.println(receivedData.volume);
    Serial.print("Received source index: ");
    Serial.println(receivedData.sourceIndex);

    delay(1000);
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
    receivedData.manualMoveReceived = false;



  } 
  
  else if (receivedData.moveToLimitReceived) {
    if (receivedData.moveToLimitAxis == "X") {
      stepper_X.runToLimit();
    } else if (receivedData.moveToLimitAxis == "Y") {
      stepper_Y.runToLimit();
    }  // Add other axes here if needed
    receivedData.moveToLimitReceived = false;
  } 
  
  else if (receivedData.manualCoordsReceived) {
    // Convert the received coordinates to steps
    float currentX = receivedData.coordX.toFloat();
    float currentY = receivedData.coordY.toFloat();
  
    float deltaX = currentX - previousX;
    float deltaY = currentY - previousY;

    // Convert deltas to steps
    long stepsX = deltaX * microstep_amount;
    long stepsY = deltaY * microstep_amount;

  
    Serial.print("deltaX=");
    Serial.print(deltaX);
    Serial.print(", deltaY=");
    Serial.println(deltaY);
  

    // Move the X and Y motors by the calculated number of steps
    multiStepper.move(stepsX, stepsY);
    multiStepper.runToPosition();

    previousX = currentX;
    previousY = currentY;

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
    int separatorIndex = manualCoordsData.indexOf(',');
    String xCoord = manualCoordsData.substring(0, separatorIndex);
    String yCoord = manualCoordsData.substring(separatorIndex + 1);

    // Extract the numerical part of the coordinates
    receivedData.coordX = xCoord.substring(xCoord.indexOf('=') + 1);
    receivedData.coordY = yCoord.substring(yCoord.indexOf('=') + 1);

    // Set the flag and store the coordinates
    receivedData.manualCoordsReceived = true;
    Serial.print("Received manualCoords: X=");
    Serial.print(receivedData.coordX);
    Serial.print(", Y=");
    Serial.println(receivedData.coordY);
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
    receivedData.wellId = receivedMessage.substring(0, firstDelimiterIndex);
    receivedData.volume = receivedMessage.substring(firstDelimiterIndex + 1, secondDelimiterIndex).toFloat();
    receivedData.sourceIndex = receivedMessage.substring(secondDelimiterIndex + 1).toInt();
    receivedData.dataReceived = true;
  }
}

void requestEvent() {
  if (receivedData.sendResponse) {
    String response = "finished";
    Serial.println("Sending response");
    Wire.write(response.c_str());
    Wire.write('\0');                   // Add a null character to indicate the end of the message
    receivedData.sendResponse = false;  // Reset the flag
  }
}