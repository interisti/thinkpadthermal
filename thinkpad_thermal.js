const Lang = imports.lang;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Panel = imports.ui.main.panel;

const Gettext = imports.gettext;
const _ = Gettext.gettext;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const { ThinkPadThermalStatusIcon } = Me.imports.thinkpad_thermal_status_icon.exports;

class ThinkPadThermal {
  _load() {
    this.timer = 1000;

    this._sensorNames = Array("CPU");
    this._sensorUnits = Array("\u00b0C");
    this._sensorValues = Array("0");
    this._fanNames = Array("status", "speed", "level");
    this._fanUnits = Array(null, "RPM", null);
    this._fanValues = Array("0", "0", "0");
  }

  _update() {
    let newSensorNames = Array();
    let newSensorValues = Array();
    let tempFile = GLib.file_get_contents('/sys/class/hwmon/hwmon3/temp1_input');
    let tempString = imports.byteArray.toString(tempFile[1], 'utf8');
    let tmpNumeric = tempString / 1000;
    newSensorNames.push("CPU");
    newSensorValues.push(tmpNumeric);

    this._sensorValues = newSensorValues;
    this._sensorNames = newSensorNames;

    let fanFile = GLib.file_get_contents('/proc/acpi/ibm/fan');
    let fanString = (
      "" + imports.byteArray.toString(fanFile[1], 'utf8')
    ).split("\n");

    this._fanValues[0] = ("" + fanString[0]).replace("status:\t\t", "");
    this._fanValues[1] = ("" + fanString[1]).replace("speed:\t\t", "");
    this._fanValues[2] = ("" + fanString[2]).replace("level:\t\t", "");
  }

  _update_speeds() {
    this._update();
    this._status_icon._set_values(this._sensorValues[0], this._fanValues[1]);

    for (let i = 0; i < this._sensorValues.length; i++) {
      this._sensorValues[i] += " \u00b0C";
    };
    this._fanValues[1] += " RPM";

    this._updatedSensorValues = this._sensorValues.concat(
      this._fanValues[0],
      this._fanValues[1],
      this._fanValues[2]
    );

    this._status_icon.update_values(this._updatedSensorValues);

    return true;
  }

  _create_menu() {
    if (!this._menu_created) {
      this._status_icon.create_menu(
        "Thermal Sensors",
        this._sensorNames,
        this._sensorValues,
        this._sensorUnits
      );
      this._status_icon.create_menu(
        "Fan Control",
        this._fanNames,
        this._fanValues,
        this._fanUnits
      );
      this._menu_created = true;
    }
  }

  enable() {
    this._menu_created = false;
    this._sensorValues = new Array();
    this._sensorNames = new Array();
    this._sensorUnits = new Array();
    this._fanValues = new Array();
    this._fanNames = new Array();
    this._fanUnits = new Array();
    global.log("Loading ...");
    this._load();
    global.log("Status_icon will be created");
    this._status_icon = new ThinkPadThermalStatusIcon();
    global.log("Global timer will be created");
    this._timerid = Mainloop.timeout_add(
      this.timer,
      Lang.bind(this, this._update_speeds)
    );
    global.log("Panel addes");
    Panel.addToStatusArea('thinkpadthermal', this._status_icon, 0);
    global.log("menu creation");
    this._create_menu();
    global.log("Value update");
    this._update();
  }

  disable() {
    this._status_icon.destroy();

    if (this._timerid != 0) {
      Mainloop.source_remove(this._timerid);
      this._timerid = 0;
    }
  }
};

var exports = {
  ThinkPadThermal
}
