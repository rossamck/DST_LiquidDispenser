#ifndef MultiStepperMotor_h
#define MultiStepperMotor_h

#include <AccelStepper.h>

class MultiStepperMotor
{
public:
    MultiStepperMotor(uint8_t step_pin, uint8_t dir_pin, int8_t limit_switch_pin = -1);
    void setMaxSpeed(float speed);
    void setAcceleration(float acceleration);
    void move(long relative_steps);
    void runToPosition();
    void runToLimit();
    long currentPosition();
    void setCurrentPosition(long position);

    AccelStepper &getXStepper() { return _stepper; }
    AccelStepper &getYStepper() { return _stepper; }

private:
    AccelStepper _stepper;
    int8_t _limit_switch_pin;
};

class MultiStepperXY
{
public:
    MultiStepperXY(MultiStepperMotor &stepper_x, MultiStepperMotor &stepper_y);
    void setMaxSpeed(float speed);
    void setAcceleration(float acceleration);
    void move(long relative_steps_x, long relative_steps_y);
    void runToPosition();

private:
    MultiStepperMotor &_stepper_x;
    MultiStepperMotor &_stepper_y;
};

#endif
