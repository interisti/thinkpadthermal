# thinkpadthernmal


Updated version of [thinkpad-x1-thermal](https://extensions.gnome.org/extension/1419/thinkpad-x1-thermal/) gnome extension to work on ubuntu 19.XX.

Cloned from https://bitbucket.org/jithurbide/thinkpadx1thermal



# Dev Notes

## Resources

https://wiki.gnome.org/Projects/GnomeShell/Extensions/StepByStepTutorial#myFirstExtension

> When you create an extension, the extension is saved at ~/.local/shared/gnome-shell/extensions with a gnome-shell extension folder format, so you can't create a project here and edit the files expecting that each change you do reflects directly in the gnome-shell. So, if we use eclipse to develop extensions, the best way is to open directly the file you are editing, like ~/.local/shared/gnome-shell/extensions/myExtensionFolder/myExtension.js

> To visualize the changes, you need to have enabled the extension. To enable the extension use gnome-tweak-tool.

> After that, every time you make a change, you will have to save the file and restart the shell (**Alt+F2** , write **"r"** without quotes, **enter**).


### look for gnome errors
`journalctl /usr/bin/gnome-shell -f`


### Create a symlink from ext dir to gnome extensions

`ln -s /home/nika/projects/interisti/thinkpadthermal /home/nika/.local/share/gnome-shell/extensions/thinkpadthermal@nikoloznikabadze.com`


### Sample upgrade to es6

https://extensions.gnome.org/review/10363
