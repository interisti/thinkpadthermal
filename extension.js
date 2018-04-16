const Extension = imports.misc.extensionUtils.getCurrentExtension();
const ThinkPadThermal = Extension.imports.thinkpad_thermal;

function init() {
    global.log("Start programm")
    return new ThinkPadThermal.ThinkPadThermal();
}