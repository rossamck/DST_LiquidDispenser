#include "MultiStepperMotor.h"

SingleStepper::SingleStepper(uint8_t step_pin, uint8_t dir_pin, int8_t limit_switch_pin, bool invert_direction)
  : _stepper(AccelStepper::DRIVER, step_pin, dir_pin), _limit_switch_pin(limit_switch_pin), _invert_direction(invert_direction) {
    if (_limit_switch_pin >= 0) {
        pinMode(_limit_switch_pin, INPUT_PULLUP);
    }
}


void SingleStepper::setMaxSpeed(float speed) {
  _stepper.setMaxSpeed(speed);
}

void SingleStepper::setAcceleration(float acceleration) {
  _stepper.setAcceleration(acceleration);
}

void SingleStepper::move(long relative_steps) {
  _stepper.move(_invert_direction ? -relative_steps : relative_steps);
}


void SingleStepper::runToPosition() {
  _stepper.runToPosition();
}

long SingleStepper::currentPosition() {
  return _invert_direction ? -_stepper.currentPosition() : _stepper.currentPosition();
}


void SingleStepper::setCurrentPosition(long position) {
  _stepper.setCurrentPosition(_invert_direction ? -position : position);
}


void SingleStepper::runToLimit() {
  if (_limit_switch_pin < 0) {
    // No limit switch connected, return immediately
    Serial.println("ERROR: No limit switch!");
    return;
  }

  Serial.println("Moving to limit!");

  // Start moving backwards, one step at a time
  long steps_moved = 0;
  while (digitalRead(_limit_switch_pin)) {
    // Keep running while the limit switch is not hit
    _stepper.move(_invert_direction ? 100 : -100);
    _stepper.runToPosition();
    steps_moved++;
  }

  // Immediately stop the motor when the limit switch is hit
  _stepper.stop();

  // Print the number of steps moved
  setCurrentPosition(0);

  Serial.print("Number of steps moved to hit limit: ");
  Serial.println(steps_moved);
}



MultiStepper::MultiStepper(SingleStepper &stepper_x, SingleStepper &stepper_y)
  : _stepper_x(stepper_x), _stepper_y(stepper_y) {}

void MultiStepper::setMaxSpeed(float speed_x, float speed_y) {
  _stepper_x.setMaxSpeed(speed_x);
  _stepper_y.setMaxSpeed(speed_y);
}

void MultiStepper::setAcceleration(float acceleration_x, float acceleration_y) {
  _stepper_x.setAcceleration(acceleration_x);
  _stepper_y.setAcceleration(acceleration_y);
}

void MultiStepper::move(long relative_steps_x, long relative_steps_y) {
  _stepper_x.move(relative_steps_x);
  _stepper_y.move(relative_steps_y);
}

void MultiStepper::runToPosition() {
  while (_stepper_x.getStepper().distanceToGo() != 0 || 
         _stepper_y.getStepper().distanceToGo() != 0) {
    _stepper_x.getStepper().run();
    _stepper_y.getStepper().run();
  }
}
