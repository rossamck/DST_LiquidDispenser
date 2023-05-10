#include "MultiStepperMotor.h"

MultiStepperMotor::MultiStepperMotor(uint8_t step_pin, uint8_t dir_pin, int8_t limit_switch_pin)
  : _stepper(AccelStepper::DRIVER, step_pin, dir_pin), _limit_switch_pin(limit_switch_pin) {
    if (_limit_switch_pin >= 0) {
        pinMode(_limit_switch_pin, INPUT_PULLUP);
    }
}

void MultiStepperMotor::setMaxSpeed(float speed) {
  _stepper.setMaxSpeed(speed);
}

void MultiStepperMotor::setAcceleration(float acceleration) {
  _stepper.setAcceleration(acceleration);
}

void MultiStepperMotor::move(long relative_steps) {
  _stepper.move(relative_steps);
}

void MultiStepperMotor::runToPosition() {
  _stepper.runToPosition();
}

long MultiStepperMotor::currentPosition() {
  return _stepper.currentPosition();
}

void MultiStepperMotor::setCurrentPosition(long position) {
  _stepper.setCurrentPosition(position);
}


void MultiStepperMotor::runToLimit() {
  if (_limit_switch_pin < 0) {
    // No limit switch connected, return immediately
    return;
  }
  
  while (digitalRead(_limit_switch_pin)) {
    _stepper.run();
  }
   Serial.println("STOP");
  _stepper.stop();
}

MultiStepperXY::MultiStepperXY(MultiStepperMotor &stepper_x, MultiStepperMotor &stepper_y)
  : _stepper_x(stepper_x), _stepper_y(stepper_y) {}

void MultiStepperXY::setMaxSpeed(float speed) {
  _stepper_x.setMaxSpeed(speed);
  _stepper_y.setMaxSpeed(speed);
}

void MultiStepperXY::setAcceleration(float acceleration) {
  _stepper_x.setAcceleration(acceleration);
  _stepper_y.setAcceleration(acceleration);
}

void MultiStepperXY::move(long relative_steps_x, long relative_steps_y) {
  _stepper_x.move(relative_steps_x);
  _stepper_y.move(relative_steps_y);
}


void MultiStepperXY::runToPosition() {
  while (_stepper_x.getXStepper().distanceToGo() != 0 || _stepper_y.getYStepper().distanceToGo() != 0) {
    _stepper_x.getXStepper().run();
    _stepper_y.getYStepper().run();
  }
}


