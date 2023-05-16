#ifndef MultiStepper_h
#define MultiStepper_h

#include <AccelStepper.h>

class SingleStepper
{
public:
    SingleStepper(uint8_t step_pin, uint8_t dir_pin, int8_t limit_switch_pin = -1, bool invert_direction = false);
    void setMaxSpeed(float speed);
    void setAcceleration(float acceleration);
    void move(long relative_steps);
    void runToPosition();
    void runToLimit();
    long currentPosition();
    void setCurrentPosition(long position);

    AccelStepper &getStepper() { return _stepper; }

private:
    AccelStepper _stepper;
    int8_t _limit_switch_pin;
        bool _invert_direction;

};

class MultiStepper
{
public:
    MultiStepper(SingleStepper &stepper_x, SingleStepper &stepper_y);
    void setMaxSpeed(float speed_x, float speed_y);
    void setAcceleration(float acceleration_x, float acceleration_y);
    void move(long relative_steps_x, long relative_steps_y);
    void runToPosition();

private:
    SingleStepper &_stepper_x;
    SingleStepper &_stepper_y;
};

#endif
