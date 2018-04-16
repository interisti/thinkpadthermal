const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

const LayoutMenuItem = new Lang.Class({
	Name: 'LayoutMenuItem',
	Extends: PopupMenu.PopupBaseMenuItem,
	_init : function (sensor, value=null, unit=null)
	{
		this.parent();

		if(value==null){
			this._nameBox = new St.BoxLayout({
				vertical: true,
				style_class: "tpt-box-title"
			});
		}else{
			this._nameBox = new St.BoxLayout({
				vertical: true,
				style_class: "tpt-box-name"
			});
		}
		this._sensor_name 	= new St.Label({ text: sensor });
		this._nameBox.add_actor(this._sensor_name);
		this.actor.add(this._nameBox);

		if(value!=null){
			this._valueBox = new St.BoxLayout({
				vertical: true,
				style_class: "tpt-box-value"
			});
			this._sensor_value	= new St.Label({ text: value });
			this._valueBox.add_actor(this._sensor_value);
			
			this.actor.add(this._valueBox);
		}
	},
	update_values : function (value)
	{
		this._sensor_value.set_text(value);
	}
});