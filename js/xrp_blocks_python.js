const PY = Blockly.Python;

//Individual Motors
Blockly.Python['xrp_motor_effort'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var value_effort = Blockly.Python.valueToCode(block, 'effort', Blockly.Python.ORDER_ATOMIC);
  var code = `motor${index}.set_effort(${value_effort})\n`;
  return code;
};

Blockly.Python['xrp_motor_speed'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var value_speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  if(value_speed == 0) value_speed = "";
  var code = `motor${index}.set_speed(${value_speed})\n`;
  return code;
};

Blockly.Python['xrp_motor_get_speed'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var code = `motor${index}.get_speed()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_motor_direction'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var value_direction = block.getFieldValue("DIRECTION");
  var code = `motor${index}._motor.flip_dir = (${value_direction})\n`;
  return code;
};

Blockly.Python['xrp_motor_get_position'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var code = `motor${index}.get_position()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_motor_get_count'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var code = `motor${index}.get_position_counts()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_motor_reset_position'] = function (block) {
  PY.definitions_['import_motor'] = 'from XRPLib.encoded_motor import EncodedMotor';
  var index = block.getFieldValue("MOTOR");
  PY.definitions_[`motor${index}_setup`] = `motor${index} = EncodedMotor.get_default_encoded_motor(${index})`;
  var code = `motor${index}.reset_encoder_position()\n`;
  return code;
};

//DriveTrain
Blockly.Python['xrp_straight_effort'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var value_dist = Blockly.Python.valueToCode(block, 'dist', Blockly.Python.ORDER_ATOMIC);
  var value_effort = Blockly.Python.valueToCode(block, 'effort', Blockly.Python.ORDER_ATOMIC);
  var code = `differentialDrive.straight(${value_dist}, ${value_effort})\n`;
  return code;
};

Blockly.Python['xrp_turn_effort'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var value_angle = Blockly.Python.valueToCode(block, 'degrees', Blockly.Python.ORDER_ATOMIC);
  var value_effort = Blockly.Python.valueToCode(block, 'effort', Blockly.Python.ORDER_ATOMIC);
  var code = `differentialDrive.turn(${value_angle}, ${value_effort})\n`;
  return code;
};

Blockly.Python['xrp_seteffort'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var value_l = Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_ATOMIC);
  var value_r = Blockly.Python.valueToCode(block, 'RIGHT', Blockly.Python.ORDER_ATOMIC);
  var code = `differentialDrive.set_effort(${value_l}, ${value_r})\n`;
  return code;
};

Blockly.Python['xrp_speed'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var value_l = Blockly.Python.valueToCode(block, 'LEFT', Blockly.Python.ORDER_ATOMIC);
  var value_r = Blockly.Python.valueToCode(block, 'RIGHT', Blockly.Python.ORDER_ATOMIC)
  var code = `differentialDrive.set_speed(${value_l}, ${value_r})\n`;
  return code;
};

Blockly.Python['xrp_arcade'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var value_s = Blockly.Python.valueToCode(block, 'STRAIGHT', Blockly.Python.ORDER_ATOMIC);
  var value_t = Blockly.Python.valueToCode(block, 'TURN', Blockly.Python.ORDER_ATOMIC);
  var code = `differentialDrive.arcade(${value_s}, ${value_t})\n`;
  return code;
};

Blockly.Python['xrp_stop_motors'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var code = `differentialDrive.stop()\n`;
  return code;
};

Blockly.Python['xrp_resetencoders'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var value_degrees = Blockly.Python.valueToCode(block, 'degrees', Blockly.Python.ORDER_ATOMIC);
  var code = `differentialDrive.reset_encoder_position()\n`;
  return code;
};

Blockly.Python['xrp_getleftencoder'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var code = `differentialDrive.get_left_encoder_position()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_getrightencoder'] = function (block) {
  PY.definitions_['import_drivetrain'] = 'from XRPLib.differential_drive import DifferentialDrive';
  PY.definitions_[`drietrain_setup`] = `differentialDrive = DifferentialDrive.get_default_differential_drive()`;
  var code = `differentialDrive.get_right_encoder_position()`;
  return [code, Blockly.Python.ORDER_NONE];
};

//Servo
Blockly.Python['xrp_servo_deg'] = function (block) {
  PY.definitions_['import_servo'] = 'from XRPLib.servo import Servo';
  var index = block.getFieldValue("SERVO");
  if(index == 1){
    PY.definitions_[`servo_setup`] = `servo1 = Servo.get_default_servo(1)`;
  }
  else {
    PY.definitions_[`servo2_setup`] = `servo2 = Servo.get_default_servo(2)`;
  }
  var value_degrees = Blockly.Python.valueToCode(block, 'degrees', Blockly.Python.ORDER_ATOMIC);
  var code = `servo${index}.set_angle(${value_degrees})\n`;
  return code;
};

//Distance
Blockly.Python['xrp_getsonardist'] = function (block) {
  PY.definitions_['import_rangefinder'] = 'from XRPLib.rangefinder import Rangefinder';
  PY.definitions_[`rangefinder_setup`] = `rangefinder = Rangefinder.get_default_rangefinder()`;
  var code = `rangefinder.distance()`;
  return [code, Blockly.Python.ORDER_NONE];
};

//reflectance
Blockly.Python['xrp_l_refl'] = function (block) {
  PY.definitions_['import_reflectance'] = 'from XRPLib.reflectance import Reflectance';
  PY.definitions_[`reflectance_setup`] = `reflectance = Reflectance.get_default_reflectance()`;
  var code = `reflectance.get_left()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_r_refl'] = function (block) {
  PY.definitions_['import_reflectance'] = 'from XRPLib.reflectance import Reflectance';
  PY.definitions_[`reflectance_setup`] = `reflectance = Reflectance.get_default_reflectance()`;
  var code = `reflectance.get_right()`;
  return [code, Blockly.Python.ORDER_NONE];
};

//Gyro
Blockly.Python['xrp_yaw'] = function (block) {
  PY.definitions_['import_imu'] = 'from XRPLib.imu import IMU';
  PY.definitions_[`imu_setup`] = `imu = IMU.get_default_imu()\nimu.calibrate(1)`;
  var code = `imu.get_yaw()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_roll'] = function (block) {
  PY.definitions_['import_imu'] = 'from XRPLib.imu import IMU';
  PY.definitions_[`imu_setup`] = `imu = IMU.get_default_imu()\nimu.calibrate(1)`;
  var code = `imu.get_roll()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_pitch'] = function (block) {
  PY.definitions_['import_imu'] = 'from XRPLib.imu import IMU';
  PY.definitions_[`imu_setup`] = `imu = IMU.get_default_imu()\nimu.calibrate(1)`;
  var code = `imu.get_pitch()`;
  return [code, Blockly.Python.ORDER_NONE];
};

//Accelerometer
Blockly.Python['xrp_acc_x'] = function (block) {
  PY.definitions_['import_imu'] = 'from XRPLib.imu import IMU';
  PY.definitions_[`imu_setup`] = `imu = IMU.get_default_imu()\nimu.calibrate(1)`;
  var code = `imu.get_acc_x()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_acc_y'] = function (block) {
  PY.definitions_['import_imu'] = 'from XRPLib.imu import IMU';
  PY.definitions_[`imu_setup`] = `imu = IMU.get_default_imu()\nimu.calibrate(1)`;
  var code = `imu.get_acc_y()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_acc_z'] = function (block) {
  PY.definitions_['import_imu'] = 'from XRPLib.imu import IMU';
  PY.definitions_[`imu_setup`] = `imu = IMU.get_default_imu()\nimu.calibrate(1)`;
  var code = `imu.get_acc_z()`;
  return [code, Blockly.Python.ORDER_NONE];
};

//Control Board
Blockly.Python['xrp_led_on'] = function (block) {
  PY.definitions_['import_board'] = 'from XRPLib.board import Board';
  PY.definitions_[`board_setup`] = `board = Board.get_default_board()`;
  var code = `board.led_on()\n`;
  return code;
};

Blockly.Python['xrp_led_off'] = function (block) {
  PY.definitions_['import_board'] = 'from XRPLib.board import Board';
  PY.definitions_[`board_setup`] = `board = Board.get_default_board()`;
  var code = `board.led_off()\n`;
  return code;
};

Blockly.Python['xrp_button_pressed'] = function (block) {
  PY.definitions_['import_board'] = 'from XRPLib.board import Board';
  PY.definitions_[`board_setup`] = `board = Board.get_default_board()`;
  var code = `board.is_button_pressed()`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xrp_wait_for_button_press'] = function (block) {
  PY.definitions_['import_board'] = 'from XRPLib.board import Board';
  PY.definitions_[`board_setup`] = `board = Board.get_default_board()`;
  var code = `board.wait_for_button()\n`
  return code;
};

//Web Server
var nextFunc = 0;
function getFuncName(){
  nextFunc++;
  return "func" + nextFunc;
}

Blockly.Python['xrp_ws_forward_button'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var func = Blockly.Python.statementToCode(block, 'func');
  var funcName = getFuncName();
  var code = `\ndef ${funcName}():\n${func}\n`
  code += `webserver.registerForwardButton(${funcName})\n`
  return code;
};

Blockly.Python['xrp_ws_back_button'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var func = Blockly.Python.statementToCode(block, 'func');
  var funcName = getFuncName();
  var code = `\ndef ${funcName}():\n${func}\n`
  code += `webserver.registerBackwardButton(${funcName})\n`
  return code;
};

Blockly.Python['xrp_ws_left_button'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var func = Blockly.Python.statementToCode(block, 'func');
  var funcName = getFuncName();
  var code = `\ndef ${funcName}():\n${func}\n`
  code += `webserver.registerLeftButton(${funcName})\n`
  return code;
};

Blockly.Python['xrp_ws_right_button'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var func = Blockly.Python.statementToCode(block, 'func');
  var funcName = getFuncName();
  var code = `\ndef ${funcName}():\n${func}\n`
  code += `webserver.registerRightButton(${funcName})\n`
  return code;
};

Blockly.Python['xrp_ws_stop_button'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var func = Blockly.Python.statementToCode(block, 'func');
  var funcName = getFuncName();
  var code = `\ndef ${funcName}():\n${func}\n`
  code += `webserver.registerStopButton(${funcName})\n`
  return code;
};

Blockly.Python['xrp_ws_add_button'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var name = block.getFieldValue("TEXT");
  var func = Blockly.Python.statementToCode(block, 'func');
  var funcName = getFuncName();
  var code = `\ndef ${funcName}():\n${func}\n`
  code += `webserver.add_button("${name}", ${funcName})\n`
  return code;
};

Blockly.Python['xrp_ws_log_data'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`; 
  data = Blockly.Python.valueToCode(block, 'DATA', Blockly.Python.ORDER_ATOMIC);
  var label  = block.getInputTargetBlock("log_name").getFieldValue("TEXT");
  var code = `webserver.log_data("${label}", ${data})\n`
  return code;
};


Blockly.Python['xrp_ws_connect_server'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var ssid = block.getInputTargetBlock("server_ssid").getFieldValue("TEXT");
  var pwd = block.getInputTargetBlock("server_pwd").getFieldValue("TEXT")
  var code = `webserver.connect_to_network(ssid="${ssid}", password="${pwd}")\nwebserver.start_server()\n`
  return code;
};

Blockly.Python['xrp_ws_start_server'] = function (block) {
  PY.definitions_['import_webserver'] = 'from XRPLib.webserver import Webserver';
  PY.definitions_[`webserver_setup`] = `webserver = Webserver.get_default_webserver()`;
  var ssid = block.getInputTargetBlock("server_ssid").getFieldValue("TEXT");
  var pwd = block.getInputTargetBlock("server_pwd").getFieldValue("TEXT")
  var code = `webserver.start_network(ssid="${ssid}", password="${pwd}")\nwebserver.start_server()\n`
  return code;
};


//Logic
Blockly.Python['xrp_sleep'] = function (block) {
  PY.definitions_['import_time'] = 'import time';
  var number_time = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC);
  var code = `time.sleep(${number_time})\n`;
  return code;
};

//Pesto Link Controller: Credit Kavin Muralikrishnan FRC Team 5338 Roboloco
Blockly.Python['pestolink_get_controller_left_x'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
  var code = `pestolink.get_axis(0)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_get_controller_left_y'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `-pestolink.get_axis(1)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_get_controller_right_x'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_axis(2)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_get_controller_right_y'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `-pestolink.get_axis(3)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_a_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(0)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_b_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(1)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_y_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(3)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_x_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(2)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_left_bumper_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(4)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_right_bumper_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(5)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_left_trigger_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(6)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['pestolink_is_right_trigger_pressed'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
   
  var code = `pestolink.get_button(7)`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Python['pestolink_get_axis'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
  var axis = block.getFieldValue("axis");
  var code = `pestolink.get_axis(${axis})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};


Blockly.Python['pestolink_get_button'] = function (block) {
  PY.definitions_['import_random']='import random\n ';
  PY.definitions_['import_pestolink']='import string\n from machine import Pin \nimport bluetooth\nfrom pestolink import PestoLinkAgent\n\nrobot_name = \"("".join(random.choice(string.ascii_lowercase) for i in range(5)))\"\npestolink = PestoLinkAgent(robot_name) \n print("The name of your robot is, robot_name")'
  var button = block.getFieldValue("num");
  var code = `pestolink.get_button(${button})`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};
