
Blockly.Blocks['xrp_color_LED'] = {
    init: function () {
        this.appendDummyInput()
          .appendField("Color LED")
          .appendField(
            new Blockly.FieldColour('#ff4040', null, {
              colourOptions: [
                // grays
                '#ffffff',
                '#000000',
                // reds
                '#ffcccc',
                '#ff6666',
                '#ff0000',
                '#cc0000',
                // oranges
                '#ffcc99',
                '#ff9966',
                '#ff9900',
                '#ff6600',
                '#cc6600',
                '#993300',
                // yellows
                '#ffff99',
                '#ffff66',
                '#ffcc66',
                '#ffcc33',
                '#cc9933',
                '#996633',
                // greens
                '#99ff99',
                '#66ff99',
                '#33ff33',
                '#00ff00',
                '#33cc00',
                '#006600',
                // turquoises
                '#99ffff',
                '#33ffff',
                '#66cccc',
                '#00cccc',
                '#339999',
                '#336666',
                // blues
                '#ccffff',
                '#66ffff',
                '#33ccff',
                '#3366ff',
                '#3333ff',
                '#0000ff',
                // purples
                '#ccccff',
                '#9999ff',
                '#6666cc',
                '#6633ff',
                '#6600cc',
                '#333399',
                // violets
                '#ffccff',
                '#ff99ff',
                '#cc66cc',
                '#cc33cc',
                '#993399',
                '#663366',
              ],
              columns: 6,
            }),
            'COLOR',
          );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(150); // darker teal
        this.setTooltip("");
        this.setHelpUrl("");
      }
  };

  Blockly.Python['xrp_color_LED'] = function (block) {
    PY.definitions_['import_board'] = 'from XRPLib.board import Board';
    PY.definitions_[`board_setup`] = `board = Board.get_default_board()`;
    var color = block.getFieldValue("COLOR");
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);   
     var code = `board.set_rgb_led(${r},${g},${b})\n`;
    return code;
  };