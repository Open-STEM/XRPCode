from ble.blerepl import uart
import sys
from micropython import const

class Joystick:

    _DEFAULT_JOYSTICK_INSTANCE = None

    X1 = const(0)
    Y1 = const(1)
    X2 = const(2)
    Y2 = const(3)
    BUTTON_A = const(4)
    BUTTON_B = const(5)
    BUTTON_X = const(6)
    BUTTON_Y = const(7)
    BUMPER_L = const(8)
    BUMPER_R = const(9)
    TRIGGER_L = const(10)
    TRIGGER_R = const(11)
    BACK = const(12)
    START = const(13)
    DPAD_UP = const(14)
    DPAD_DN = const(15)
    DPAD_L = const(16)
    DPAD_R = const(17)

    joyData = [
    0.0,
    0.0,
    0.0,
    0.0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    @classmethod
    def get_default_joystick(cls):
        """
        Get the default XRP bluetooth joystick instance. This is a singleton, so only one instance of the reflectance sensor will ever exist.
        """
        if cls._DEFAULT_JOYSTICK_INSTANCE is None:
            cls._DEFAULT_JOYSTICK_INSTANCE = cls()
        return cls._DEFAULT_JOYSTICK_INSTANCE

    def __init__(self):
        """
        """

    def startBluetoothJoystick(self):
        for i in range(len(self.joyData)):
            self.joyData[i] = 0.0
        uart.set_data_callback(self._data_callback)
        sys.stdout.write(chr(27))
        sys.stdout.write(chr(101))


    def stopBluetoothJoystick(self):
        sys.stdout.write(chr(27))
        sys.stdout.write(chr(102))

    def getJoystickValue(self, index):
        return -self.joyData[index] #returning the negative to make normal for user 

    def isJoystickButtonPressed(self, index):
        return self.joyData[index] > 0      

    def _data_callback(self, data):
        if(data[0] == 0x55 and len(data) == data[1] + 2):
            for i in range(2, data[1] + 2, 2):
                self.joyData[data[i]] = round(data[i + 1]/127.5 - 1, 2)
            
        
