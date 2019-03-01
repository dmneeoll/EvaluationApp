@echo off
rem del www\.vscode /s /q
del www\*.bak /s
del www\Web.config
cordova-hcp build

