const Lang 		= imports.lang;
const Gio 		= imports.gi.Gio;
const GLib 		= imports.gi.GLib;
const Mainloop 	= imports.mainloop;
const Panel 	= imports.ui.main.panel;

const Gettext 	= imports.gettext;
const _ 		= Gettext.gettext;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const ThinkPadThermalStatusIcon = Extension.imports.thinkpad_thermal_status_icon;

const ThinkPadThermal = new Lang.Class({

	Name: 'ThinkPadThermal',
	_init : 	function ()
	{
		let theme = imports.gi.Gtk.IconTheme.get_default();
    	theme.append_search_path(Extension.path + "/icons");
	},
	_load : 	function ()
	{
		this.timer = 5000;

		this._sensorNames = Array(
			"CPU",
			"APS",
			"PCM",
			"GPU",
			"BAT",
			"UBS",
			"BAT",
			"UBP",
			"BUS",
			"PCI",
			"PWR"
		);
		this._sensorUnits = Array("\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C","\u00b0C");
		this._fanNames = Array("status", "speed", "level");
		this._fanUnits = Array(null, "RPM", null);
	},
	_update : 	function ()
	{
	  global.log("update thinkpad")
		let newSensorNames	= Array();
    let newSensorValues = Array();
   // global.log("From thinkpad_thermal file not found");
		let tempFile = GLib.file_get_contents('/sys/devices/virtual/hwmon/hwmon0/temp1_input');
    let tempString 	= tempFile[1].toString('utf8');
    // global.log("Value of string : " + tempString + " of type : " + typeof tempString );
    newSensorNames.push("CPU");
    newSensorValues.push(tempString);


    this._sensorValues = newSensorValues;
    this._sensorNames  = newSensorNames;

    //global.log("Internal sensor value : " + this._sensorValues[0] + " of type " + typeof this._sensorValues[0])

    let fanFile 	= GLib.file_get_contents('/proc/acpi/ibm/fan');
    let fanString 	= ("" + fanFile[1]).split("\n");

    this._fanValues[0] = ("" + fanString[0]).replace("status:\t\t","");
    this._fanValues[1] = ("" + fanString[1]).replace("speed:\t\t","");
    this._fanValues[2] = ("" + fanString[2]).replace("level:\t\t","");

    //global.log("Internal fan value : " + this._fanValues[1] + " of type " + typeof this._fanValues[1])

	},
	_update_speeds : function ()
	{
		this._update();
		this._status_icon._set_values(this._sensorValues[0],this._fanValues[1]);

   // global.log("Number of sensors to update : " + this._sensorValues.length)
		for (var i = 0; i < this._sensorValues.length; i++) {
			this._sensorValues[i]+=" \u00b0C";
		};
		this._fanValues[1]+=" RPM";

		this._updatedSensorValues = this._sensorValues.concat(this._fanValues[1]);
		this._status_icon.update_values(this._updatedSensorValues);

		return true;
	},
	_create_menu : function()
	{
		if(!this._menu_created) {
			this._status_icon.create_menu("Thermal Sensors", this._sensorNames, this._sensorValues, this._sensorUnits);
			this._status_icon.create_menu("Fan Control", this._fanNames, this._fanValues, this._fanUnits);
			this._menu_created = true;
		}

	},
	enable : 	function ()
	{
		this._menu_created 	= false;
		this._sensorValues	= new Array();
		this._sensorNames	= new Array();
		this._sensorUnits	= new Array();
		this._fanValues 	= new Array();
		this._fanNames 		= new Array();
		this._fanUnits		= new Array();
    global.log("Loading ...");
		this._load();
    global.log("Status_icon will be created");
		this._status_icon = new ThinkPadThermalStatusIcon.ThinkPadThermalStatusIcon(this);
		global.log("Global timer will be created");
		this._timerid = Mainloop.timeout_add(this.timer, Lang.bind(this, this._update_speeds));
    global.log("Panel addes");
		Panel.addToStatusArea('thinkpadthermal', this._status_icon, 0);
    global.log("menu creation");
    this._create_menu();
    global.log("Value update");
		this._update();


	},
	disable : 	function ()
	{
		this._status_icon.destroy();

		if (this._timerid !=0)
        {
          Mainloop.source_remove(this._timerid);
          this._timerid = 0;
        }
	}

});