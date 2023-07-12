from .motor import Motor
from .encoder import Encoder
from machine import Timer
from .controller import Controller
from .pid import PID

class EncodedMotor:

    _DEFAULT_LEFT_MOTOR_INSTANCE = None
    _DEFAULT_RIGHT_MOTOR_INSTANCE = None
    _DEFAULT_MOTOR_THREE_INSTANCE = None
    _DEFAULT_MOTOR_FOUR_INSTANCE = None

    @classmethod
    def get_default_encoded_motor(cls, index:int = 1):
        """
        Get one of the default XRP v2 motor instances. These are singletons, so only one instance of each of these will ever exist.
        Left Motor is the default, so if no index (or an invalid index) is specified, the left motor will be returned.

        :param index: The index of the motor to get; 1 for left, 2 for right, 3 for motor 3, 4 for motor 4
        :type index: int
        """
        if index == 1:
            if cls._DEFAULT_LEFT_MOTOR_INSTANCE is None:
                cls._DEFAULT_LEFT_MOTOR_INSTANCE = cls(
                    Motor(6, 7, flip_dir=True),
                    Encoder(0, 4, 5)
                )
            motor = cls._DEFAULT_LEFT_MOTOR_INSTANCE
        elif index == 2:
            if cls._DEFAULT_RIGHT_MOTOR_INSTANCE is None:
                cls._DEFAULT_RIGHT_MOTOR_INSTANCE = cls(
                    Motor(14, 15),
                    Encoder(1, 12, 13)
                )
            motor = cls._DEFAULT_RIGHT_MOTOR_INSTANCE
        elif index == 3:
            if cls._DEFAULT_MOTOR_THREE_INSTANCE is None:
                cls._DEFAULT_MOTOR_THREE_INSTANCE = cls(
                    Motor(2, 3),
                    Encoder(2, 0, 1)
                )
            motor = cls._DEFAULT_MOTOR_THREE_INSTANCE
        elif index == 4:
            if cls._DEFAULT_MOTOR_FOUR_INSTANCE is None:
                cls._DEFAULT_MOTOR_FOUR_INSTANCE = cls(
                    Motor(10, 11, flip_dir=True),
                    Encoder(3, 8, 9)
                )
            motor = cls._DEFAULT_MOTOR_FOUR_INSTANCE
        else:
            return Exception("Invalid motor index")
        return motor
    
    def __init__(self, motor: Motor, encoder: Encoder):
        
        self._motor = motor
        self._encoder = encoder

        self.target_speed = None
        self.DEFAULT_SPEED_CONTROLLER = PID(
            kp=5,
            ki=0.25,
            kd=0,
        )
        self.speedController = self.DEFAULT_SPEED_CONTROLLER
        self.prev_position = 0
        self.speed = 0
        # Use a virtual timer so we can leave the hardware timers up for the user
        self.updateTimer = Timer(-1)

    def set_effort(self, effort: float):
        """
        :param effort: The effort to set this motor to, from -1 to 1
        :type effort: float
        """
        self._motor.set_effort(effort)

    def get_position(self) -> float:
        """
        :return: The position of the encoded motor, in revolutions, relative to the last time reset was called.
        :rtype: float
        """
        if self._motor.flip_dir:
            invert = -1
        else:
            invert = 1
        return self._encoder.get_position()*invert
    
    def get_position_ticks(self) -> int:
        """
        :return: The position of the encoded motor, in encoder ticks, relative to the last time reset was called.
        :rtype: int
        """
        if self._motor.flip_dir:
            invert = -1
        else:
            invert = 1
        return self._encoder.get_position_ticks()*invert

    def reset_encoder_position(self):
        """
        Resets the encoder position back to zero.
        """
        self._encoder.reset_encoder_position()

    def get_speed(self) -> float:
        """
        :return: The speed of the motor, in rpm
        :rtype: float
        """
        # Convert from ticks per 20ms to rpm (60 sec/min, 50 Hz)
        return self.speed*(60*50)/self._encoder.ticks_per_rev

    def set_speed(self, speed_rpm: float | None = None):
        """
        Sets target speed (in rpm) to be maintained passively
        Call with no parameters to turn off speed control

        :param target_speed_rpm: The target speed for the motor in rpm, or None
        :type target_speed_rpm: float, or None
        """
        if speed_rpm is None:
            self.target_speed = None
            self.set_effort(0)
            return
        # If the update timer is not running, start it at 50 Hz (20ms updates)
        self.updateTimer.init(period=20, callback=lambda t:self._update())
        # Convert from rev per min to ticks per 20ms (60 sec/min, 50 Hz)
        self.target_speed = speed_rpm*self._encoder.ticks_per_rev/(60*50)

    def set_speed_controller(self, new_controller: Controller):
        """
        Sets a new controller for speed control

        :param new_controller: The new Controller for speed control
        :type new_controller: Controller
        """
        self.speedController = new_controller

    def _update(self):
        """
        Non-api method; used for updating motor efforts for speed control
        """
        current_position = self.get_position_ticks()
        self.speed = current_position - self.prev_position
        if self.target_speed is not None:
            error = self.target_speed - self.speed
            effort = self.speedController.tick(error)
            self._motor.set_effort(effort)
        else:
            self.updateTimer.deinit()

        self.prev_position = current_position

