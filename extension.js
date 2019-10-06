var Extension = imports.misc.extensionUtils.getCurrentExtension();
var ThinkPadThermal = Extension.imports.thinkpad_thermal;

function init() {
  global.log("Start programm")
  return new ThinkPadThermal.ThinkPadThermal();
}
