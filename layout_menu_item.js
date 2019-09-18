const GObject = imports.gi.GObject;
const PopupMenu = imports.ui.popupMenu;
const St = imports.gi.St;

const LayoutMenuItem = GObject.registerClass(
  class _LayoutMenuItem extends PopupMenu.PopupBaseMenuItem {
    _init(sensor, value = null, unit = null) {
      super._init()

      if (value == null) {
        this._nameBox = new St.BoxLayout({
          vertical: true,
          style_class: "tpt-box-title"
        });
      } else {
        this._nameBox = new St.BoxLayout({
          vertical: true,
          style_class: "tpt-box-name"
        });
      }
      this._sensor_name = new St.Label({ text: sensor });
      this._nameBox.add_actor(this._sensor_name);
      this.add(this._nameBox);

      if (value != null) {
        this._valueBox = new St.BoxLayout({
          vertical: true,
          style_class: "tpt-box-value"
        });
        this._sensor_value = new St.Label({ text: value });
        this._valueBox.add_actor(this._sensor_value);

        this.add(this._valueBox);
      }
    }

    update_values(value) {
      this._sensor_value.set_text(value);
    }
  });

var exports = {
  LayoutMenuItem
}
