const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Shell = imports.gi.Shell;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Main = imports.ui.main;
const Gtk = imports.gi.Gtk;
const Clutter = imports.gi.Clutter;
const GObject = imports.gi.GObject;

const Gettext = imports.gettext;
const _ = Gettext.gettext;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const { LayoutMenuItem } = Me.imports.layout_menu_item.exports;

const ThinkPadThermalStatusIcon = GObject.registerClass(
  class _ThinkPadThermalStatusIcon extends PanelMenu.Button {
    _init() {
      super._init(0.0);

      this._box = new St.BoxLayout();

      this._cpu_icon = this._get_icon('cpu');
      this._fan_icon = this._get_icon('fan');

      this._cpu_value = new St.Label({
        text: "0",
        style_class: "tpt-status-cpu"
      });
      this._fan_value = new St.Label({
        text: "0",
        style_class: "tpt-status-fan"
      });

      this._cpu_unit = new St.Label({
        text: this._get_unit("cpu"),
        style_class: "tpt-unit-cpu"
      });
      this._fan_unit = new St.Label({
        text: this._get_unit("fan"),
        style_class: "tpt-unit-fan"
      });

      this._box.add_actor(this._cpu_icon);
      this._box.add_actor(this._cpu_value);
      this._box.add_actor(this._cpu_unit);

      this._box.add_actor(this._fan_icon);
      this._box.add_actor(this._fan_value);
      this._box.add_actor(this._fan_unit);

      this.add_actor(this._box);

      this._layouts = new Array();
    }

    create_menu(name, sensors, values, units) {
      this._menu = new LayoutMenuItem(name);
      this.menu.addMenuItem(this._menu);

      for (let i = 0; i < sensors.length; ++i) {
        let layout = new LayoutMenuItem(sensors[i], values[i], units[i]);
        this._layouts.push(layout);
        this.menu.addMenuItem(layout);
      }
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    }

    update_values(values) {
      for (let i = 0; i < values.length; ++i) {
        this._layouts[i].update_values(values[i]);
      }
    }

    _get_icon(name) {
      let iconname = "";

      switch (name) {
        case "cpu":
          iconname = "cpu-symbolic";
          break;
        case "fan":
          iconname = "fan-symbolic";
          break;
        default:
          iconname = "temperature-symbolic";
      }

      const gicon = Gio.icon_new_for_string(Me.path + `/icons/${iconname}.svg`);
      return new St.Icon({
        gicon,
        icon_size: 16
      });
    }

    _get_unit(name) {
      let unit = "";

      switch (name) {
        case "cpu":
          unit = " \u00b0C";
          break;
        case "fan":
          unit = " RPM";
          break;
        default:
          unit = " \u00b0C";
      }

      return unit;
    }

    _set_values(cpu, fan) {
      this._cpu_value.set_text((cpu).toString());
      this._fan_value.set_text(fan);
    }
  });

var exports = {
  ThinkPadThermalStatusIcon
}
