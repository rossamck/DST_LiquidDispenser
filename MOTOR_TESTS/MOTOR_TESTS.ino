#include <AccelStepper.h>

// Define the stepper motor connections
// IC1 pin definitions
#define X_DIR_PIN 2
#define X_STEP_PIN 3


// IC2 pin definitions
#define Y_DIR_PIN 4
#define Y_STEP_PIN 5

// IC3 pin definitions
#define Z_DIR_PIN 7
#define Z_STEP_PIN 6

// IC4 pin definitions
#define PIP_DIR_PIN 8
#define PIP_STEP_PIN 9


#define ENABLE 4 //unused

// Define the microstepping pins
#define M0_PIN 11
#define M1_PIN 12
#define M2_PIN 13


//Full turn equal to number of steps per full rotation * microstepping amount
//Currently using 1/8 microstepping
int microstep_amount = 8;
int fullturn_400 = 400 * microstep_amount;
int fullturn_200 = 200 * microstep_amount;

// Create a new AccelStepper object
AccelStepper stepper_X(AccelStepper::DRIVER, X_STEP_PIN, X_DIR_PIN);
AccelStepper stepper_Y(AccelStepper::DRIVER, Y_STEP_PIN, Y_DIR_PIN);
AccelStepper stepper_Z(AccelStepper::DRIVER, Z_STEP_PIN, Z_DIR_PIN);
AccelStepper stepper_PIP(AccelStepper::DRIVER, PIP_STEP_PIN, PIP_DIR_PIN);

void setup() {
  // Define the microstepping pins as outputs
  pinMode(M0_PIN, OUTPUT);
  pinMode(M1_PIN, OUTPUT);
  pinMode(M2_PIN, OUTPUT);
  pinMode(ENABLE, OUTPUT);

  // Set the microstepping mode to 1/8 step
  digitalWrite(M0_PIN, HIGH);
  digitalWrite(M1_PIN, HIGH);
  digitalWrite(M2_PIN, LOW);

  // Set the maximum speed and acceleration
  stepper_X.setMaxSpeed(10000);
  stepper_X.setAcceleration(2000);

  stepper_Y.setMaxSpeed(10000);
  stepper_Y.setAcceleration(2000);
  
  stepper_Z.setMaxSpeed(10000);
  stepper_Z.setAcceleration(2000);
  
  stepper_PIP.setMaxSpeed(10000);
  stepper_PIP.setAcceleration(2000);

  Serial.begin(115200); //Enable serial comms for debugging
}

void loop() {
  // Move the X direction motor forward 10 rotations (say halfway on the X axis for argument sake)
  Serial.println("Rotating X clockwise 10 times");
  stepper_X.move(fullturn_400*10);
  stepper_X.runToPosition();

  // Move in Y direction
  Serial.println("Rotating Y clockwise 10 times");
  stepper_Y.move(fullturn_400*10);
  stepper_Y.runToPosition();

  //Lower pippete with Z axis motor (3 full rotations)
  Serial.println("Rotating Z clockwise 3 times");
  stepper_Z.move(fullturn_200*3);
  stepper_Z.runToPosition();

  //Dispense pipette (half rotation forward then back 3 times - needs editing)
  for (int i = 0; i < 3; i++) {
    Serial.println("Clicking pipette");
    stepper_PIP.move(fullturn_200*0.5);
    stepper_PIP.runToPosition();
    stepper_PIP.move(-fullturn_200*0.5);
    stepper_PIP.runToPosition();
  }
  

  //Move pippete back up with Z axis motor (3 full rotations)
  Serial.println("Rotating Z anticlockwise 3 times");
  stepper_Z.move(-fullturn_200*3);
  stepper_Z.runToPosition();

  // Move the Y direction motor back 10 rotations
  Serial.println("Rotating Y anticlockwise 10 times");
  stepper_Y.move(-fullturn_400*10);
  stepper_Y.runToPosition();

  // Move the X direction motor back 10 rotations
  Serial.println("Rotating X anticlockwise 10 times");
  stepper_X.move(-fullturn_400*10);
  stepper_X.runToPosition();
}
