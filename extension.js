const Me = imports.misc.extensionUtils.getCurrentExtension();
const { ThinkPadThermal } = Me.imports.thinkpad_thermal.exports;

function init() {
  global.log("Start programm")
  return new ThinkPadThermal();
}
