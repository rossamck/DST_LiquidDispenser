#include <AccelStepper.h>

// Define the stepper motor connections
#define STEP_PIN 2
#define DIR_PIN 3
#define ENABLE 4

// Define the microstepping pins
#define M1_PIN 10
#define M2_PIN 9
#define M3_PIN 8

int fullturn = 400*8;

// Create a new AccelStepper object
AccelStepper stepper(AccelStepper::DRIVER, STEP_PIN, DIR_PIN);

void setup() {
  // Define the microstepping pins as outputs
  pinMode(M1_PIN, OUTPUT);
  pinMode(M2_PIN, OUTPUT);
  pinMode(M3_PIN, OUTPUT);
  pinMode(ENABLE, OUTPUT);

  // Set the microstepping mode to 1/16 step
  digitalWrite(M1_PIN, HIGH);
  digitalWrite(M2_PIN, HIGH);
  digitalWrite(M3_PIN, LOW);

  // Set the maximum speed and acceleration
  stepper.setMaxSpeed(10000);
  stepper.setAcceleration(2000);
}

void loop() {
  // digitalWrite(ENABLE, LOW);
  // Move the stepper motor forward 1000 steps
  stepper.move(fullturn*10);
  stepper.runToPosition();

  // digitalWrite(ENABLE, HIGH);
  // Move the stepper motor backward 1000 steps
  stepper.move(-fullturn);
  stepper.runToPosition();
}
