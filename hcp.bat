@echo off
del www\*.bak /s
del www\Web.config
cordova-hcp build

