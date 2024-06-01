var blocklyToolbox = {
    "contents": [
        {
            "kind": "CATEGORY",
            "name": "Individual Motors",
            "colour": "#a55b65", // crimson red
            "contents": [
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_effort",
                    "inputs":{
                        "effort": {"shadow": {"type": "math_number", "fields": {"NUM": "0.5"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_speed",
                    "inputs":{
                        "speed": {"shadow": {"type": "math_number", "fields": {"NUM": "60"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_direction",
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_get_speed",
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_get_position",
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_get_count",
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_motor_reset_position",
                },
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "DriveTrain",
            "colour": "#a5675b", // rust orange
            "contents": [
                {
                    "kind": "BLOCK",
                    "type": "xrp_straight_effort",
                    "inputs":{
                        "dist": {"shadow": {"type": "math_number", "fields": {"NUM": "20"}}},
                        "effort": {"shadow": {"type": "math_number", "fields": {"NUM": "0.5"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_turn_effort",
                    "inputs":{
                        "degrees": {"shadow": {"type": "math_number", "fields": {"NUM": "90"}}},
                        "effort": {"shadow": {"type": "math_number", "fields": {"NUM": "0.5"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_seteffort",
                    "inputs":{
                        "LEFT": {"shadow": {"type": "math_number", "fields": {"NUM": "0.5"}}},
                        "RIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": "0.5"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_speed",
                    "inputs":{
                        "LEFT": {"shadow": {"type": "math_number", "fields": {"NUM": "60"}}},
                        "RIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": "60"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_arcade",
                    "inputs":{
                        "STRAIGHT": {"shadow": {"type": "math_number", "fields": {"NUM": "0.8"}}},
                        "TURN": {"shadow": {"type": "math_number", "fields": {"NUM": "0.2"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_stop_motors"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_resetencoders"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_getleftencoder"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_getrightencoder"
                },
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Servos",
            "colour": "#a55ba5", // purple/pink
            "contents": [
                {
                    "kind": "BLOCK",
                    "type": "xrp_servo_deg",
                    "inputs":{
                        "degrees": {"shadow": {"type": "math_number", "fields": {"NUM": "90"}}}
                    }
                },
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Sensors",
            "colour": "#80a55b", // LIGHT GREEN
            "contents": [
                {
                "kind": "CATEGORY",
                "name": "Distance",
                "colour": "#80a55b",
                "contents": [
                    {
                        "kind": "BLOCK",
                        "type": "xrp_getsonardist"
                    },
                ]},
                {
                    "kind": "CATEGORY",
                    "name": "Reflectance",
                    "colour": "#80a55b",
                    "contents": [
                    {
                        "kind": "BLOCK",
                        "type": "xrp_l_refl"
                    },
                    {
                        "kind": "BLOCK",
                        "type": "xrp_r_refl"
                    },
                ]},
                {
                    "kind": "CATEGORY",
                    "name": "Gyro",
                    "colour": "#80a55b",
                    "contents": [
                    {
                        "kind": "BLOCK",
                        "type": "xrp_yaw"
                    },
                    {
                        "kind": "BLOCK",
                        "type": "xrp_roll"
                    },
                    {
                        "kind": "BLOCK",
                        "type": "xrp_pitch"
                    }
                ]},
                {
                    "kind": "CATEGORY",
                    "name": "Accelerometer",
                    "colour": "#80a55b",
                    "contents": [
                    {
                        "kind": "BLOCK",
                        "type": "xrp_acc_x"
                    },
                    {
                        "kind": "BLOCK",
                        "type": "xrp_acc_y"
                    },
                    {
                        "kind": "BLOCK",
                        "type": "xrp_acc_z"
                    }
                ]},
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Controller",
            "colour": "#a5a55b",
            "contents": [
                {
                    "kind": "CATEGORY",
                    "name": "JoyStick",
                    "colour": "#a5a55b",
                    "contents": [
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_get_controller_left_x"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_get_controller_left_y"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_get_controller_right_x"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_get_controller_right_y"
                        },
                    ]
                },
                {
                    "kind": "CATEGORY",
                    "name": "Buttons",
                    "colour": "#a5a55b",
                    "contents": [
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_a_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_b_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_x_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_y_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_right_trigger_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_left_trigger_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_right_bumper_pressed"
                        },
                        {
                            "kind": "BLOCK",
                            "type": "pestolink_is_left_bumper_pressed"
                        },
                    ]
                }
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Control Board",
            "colour": "#5ba580", // cool green
            "contents": [
                {
                    "kind": "BLOCK",
                    "type": "xrp_led_on"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_led_off"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_button_pressed"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_wait_for_button_press"
                }
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Web Server",
            "colour": "#5b99a5", // turquoise
            "contents": [
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_forward_button"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_back_button"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_left_button"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_right_button"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_stop_button"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_add_button"
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_log_data",
                    "inputs":{
                        "log_name": {"shadow": {"type": "text", "field": {"text": "label"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_start_server",
                    "blockxml": "<block type=\"xrp_ws_start_server\"><value name=\"server_ssid\">\n<shadow type=\"text\">\n<field name=\"TEXT\">xrp_1</field>\n</shadow>\n</value>\n      <value name=\"server_pwd\">\n<shadow type=\"text\">\n<field name=\"TEXT\"></field>\n</shadow>\n</value>\n</block>",
                },
                {
                    "kind": "BLOCK",
                    "type": "xrp_ws_connect_server",
                    "blockxml": "<block type=\"xrp_ws_connect_server\"><value name=\"server_ssid\">\n<shadow type=\"text\">\n<field name=\"TEXT\">xrp_1</field>\n</shadow>\n</value>\n      <value name=\"server_pwd\">\n<shadow type=\"text\">\n<field name=\"TEXT\"></field>\n</shadow>\n</value>\n</block>",
                },
            ]
        },
         {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "type": "xrp_sleep",
                    "inputs":{
                        "TIME": {"shadow": {"type": "math_number", "fields": {"NUM": "0.5"}}}
                    },
                },
                {
                    "kind": "BLOCK",
                    "type": "controls_if"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"logic_compare\">\n                <field name=\"OP\">EQ</field>\n              </block>",
                    "type": "logic_compare"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"logic_operation\">\n                <field name=\"OP\">AND</field>\n              </block>",
                    "type": "logic_operation"
                },
                {
                    "kind": "BLOCK",
                    "type": "logic_negate"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"logic_boolean\">\n                <field name=\"BOOL\">TRUE</field>\n              </block>",
                    "type": "logic_boolean"
                },
                {
                    "kind": "BLOCK",
                    "type": "logic_null"
                },
                {
                    "kind": "BLOCK",
                    "type": "logic_ternary"
                }
            ],
            "name": "Logic",
            "colour": "#5b80a5" // slate blue
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"controls_repeat_ext\">\n                <value name=\"TIMES\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">10</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "controls_repeat_ext"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"controls_whileUntil\">\n                <field name=\"MODE\">WHILE</field>\n              </block>",
                    "type": "controls_whileUntil"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"controls_for\">\n                <field name=\"VAR\" id=\"FgA,0kVszQhxNMx=)la5\">i</field>\n                <value name=\"FROM\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">1</field>\n                  </shadow>\n                </value>\n                <value name=\"TO\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">10</field>\n                  </shadow>\n                </value>\n                <value name=\"BY\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">1</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "controls_for"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"controls_forEach\">\n                <field name=\"VAR\" id=\"9{j=i/F_P/N0P#IyZ@13\">j</field>\n              </block>",
                    "type": "controls_forEach"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"controls_flow_statements\">\n                <field name=\"FLOW\">BREAK</field>\n              </block>",
                    "type": "controls_flow_statements"
                }
            ],
            "name": "Loops",
            "colour": "#5ba55b" // grass green
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_number\">\n                <field name=\"NUM\">0</field>\n              </block>",
                    "type": "math_number"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_arithmetic\">\n                <field name=\"OP\">ADD</field>\n                <value name=\"A\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">1</field>\n                  </shadow>\n                </value>\n                <value name=\"B\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">1</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_arithmetic"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_single\">\n                <field name=\"OP\">ROOT</field>\n                <value name=\"NUM\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">9</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_single"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_trig\">\n                <field name=\"OP\">SIN</field>\n                <value name=\"NUM\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">45</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_trig"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_constant\">\n                <field name=\"CONSTANT\">PI</field>\n              </block>",
                    "type": "math_constant"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_number_property\">\n                <mutation divisor_input=\"false\"></mutation>\n                <field name=\"PROPERTY\">EVEN</field>\n                <value name=\"NUMBER_TO_CHECK\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">0</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_number_property"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_round\">\n                <field name=\"OP\">ROUND</field>\n                <value name=\"NUM\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">3.1</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_round"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_on_list\">\n                <mutation op=\"SUM\"></mutation>\n                <field name=\"OP\">SUM</field>\n              </block>",
                    "type": "math_on_list"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_modulo\">\n                <value name=\"DIVIDEND\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">64</field>\n                  </shadow>\n                </value>\n                <value name=\"DIVISOR\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">10</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_modulo"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_constrain\">\n                <value name=\"VALUE\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">50</field>\n                  </shadow>\n                </value>\n                <value name=\"LOW\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">1</field>\n                  </shadow>\n                </value>\n                <value name=\"HIGH\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">100</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_constrain"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"math_random_int\">\n                <value name=\"FROM\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">1</field>\n                  </shadow>\n                </value>\n                <value name=\"TO\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">100</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "math_random_int"
                },
                {
                    "kind": "BLOCK",
                    "type": "math_random_float"
                }
            ],
            "name": "Math",
            "colour": "#5b67a5" // indigo blue
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_print\">\n                <value name=\"TEXT\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">abc</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_print"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text\">\n                <field name=\"TEXT\"></field>\n              </block>",
                    "type": "text"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_join\">\n                <mutation items=\"2\"></mutation>\n              </block>",
                    "type": "text_join"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_append\">\n                <field name=\"VAR\" id=\"dd-~qR|Y8067Rw6PQ`CU\">item</field>\n                <value name=\"TEXT\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\"></field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_append"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_length\">\n                <value name=\"VALUE\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">abc</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_length"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_isEmpty\">\n                <value name=\"VALUE\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\"></field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_isEmpty"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_indexOf\">\n                <field name=\"END\">FIRST</field>\n                <value name=\"VALUE\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"!8T!Ua3M|iS_pf63Fo8P\">text</field>\n                  </block>\n                </value>\n                <value name=\"FIND\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">abc</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_indexOf"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_charAt\">\n                <mutation at=\"true\"></mutation>\n                <field name=\"WHERE\">FROM_START</field>\n                <value name=\"VALUE\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"!8T!Ua3M|iS_pf63Fo8P\">text</field>\n                  </block>\n                </value>\n              </block>",
                    "type": "text_charAt"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_getSubstring\">\n                <mutation at1=\"true\" at2=\"true\"></mutation>\n                <field name=\"WHERE1\">FROM_START</field>\n                <field name=\"WHERE2\">FROM_START</field>\n                <value name=\"STRING\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"!8T!Ua3M|iS_pf63Fo8P\">text</field>\n                  </block>\n                </value>\n              </block>",
                    "type": "text_getSubstring"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_changeCase\">\n                <field name=\"CASE\">UPPERCASE</field>\n                <value name=\"TEXT\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">abc</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_changeCase"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_trim\">\n                <field name=\"MODE\">BOTH</field>\n                <value name=\"TEXT\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">abc</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_trim"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"text_prompt_ext\">\n                <mutation type=\"TEXT\"></mutation>\n                <field name=\"TYPE\">TEXT</field>\n                <value name=\"TEXT\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">abc</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "text_prompt_ext"
                }
            ],
            "name": "Text",
            "colour": "#5ba58c" // seafoam green
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_create_with\">\n                <mutation items=\"0\"></mutation>\n              </block>",
                    "type": "lists_create_with"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_create_with\">\n                <mutation items=\"3\"></mutation>\n              </block>",
                    "type": "lists_create_with"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_repeat\">\n                <value name=\"NUM\">\n                  <shadow type=\"math_number\">\n                    <field name=\"NUM\">5</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "lists_repeat"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_length\"></block>",
                    "type": "lists_length"
                },
                {
                    "kind": "BLOCK",
                    "type": "lists_isEmpty"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_indexOf\">\n                <field name=\"END\">FIRST</field>\n                <value name=\"VALUE\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"99zG#BOx8Ju]uWKIKU.J\">list</field>\n                  </block>\n                </value>\n              </block>",
                    "type": "lists_indexOf"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_getIndex\">\n                <mutation statement=\"false\" at=\"true\"></mutation>\n                <field name=\"MODE\">GET</field>\n                <field name=\"WHERE\">FROM_START</field>\n                <value name=\"VALUE\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"99zG#BOx8Ju]uWKIKU.J\">list</field>\n                  </block>\n                </value>\n              </block>",
                    "type": "lists_getIndex"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_setIndex\">\n                <mutation at=\"true\"></mutation>\n                <field name=\"MODE\">SET</field>\n                <field name=\"WHERE\">FROM_START</field>\n                <value name=\"LIST\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"99zG#BOx8Ju]uWKIKU.J\">list</field>\n                  </block>\n                </value>\n              </block>",
                    "type": "lists_setIndex"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_getSublist\">\n                <mutation at1=\"true\" at2=\"true\"></mutation>\n                <field name=\"WHERE1\">FROM_START</field>\n                <field name=\"WHERE2\">FROM_START</field>\n                <value name=\"LIST\">\n                  <block type=\"variables_get\">\n                    <field name=\"VAR\" id=\"99zG#BOx8Ju]uWKIKU.J\">list</field>\n                  </block>\n                </value>\n              </block>",
                    "type": "lists_getSublist"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_split\">\n                <mutation mode=\"SPLIT\"></mutation>\n                <field name=\"MODE\">SPLIT</field>\n                <value name=\"DELIM\">\n                  <shadow type=\"text\">\n                    <field name=\"TEXT\">,</field>\n                  </shadow>\n                </value>\n              </block>",
                    "type": "lists_split"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "<block type=\"lists_sort\">\n                <field name=\"TYPE\">NUMERIC</field>\n                <field name=\"DIRECTION\">1</field>\n              </block>",
                    "type": "lists_sort"
                }
            ],
            "name": "Lists",
            "colour": "#745ba5" // eggplant purple
        },
        {
            "kind": "CATEGORY",
            "name": "Variables",
            "colour": "#a55b80", // fuschia
            "custom": "VARIABLE"
        },
        {
            "kind": "CATEGORY",
            "name": "Functions",
            "colour": "#995ba5", // purple
            "custom": "PROCEDURE"
        },
        {
            "kind": "SEP"
        }
    ],
    "xmlns": "https://developers.google.com/blockly/xml",
    "id": "toolbox",
    "style": "display: none"
}
