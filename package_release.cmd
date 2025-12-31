@echo off
ECHO Preparing to package project...

REM Check and delete existing package.zip
if exist "package.zip" (
    ECHO Deleting existing package.zip...
    del "package.zip"
)

ECHO Compressing files into package.zip...
REM Includes: templates folder, settings.yaml, theme.yaml, README.md
tar.exe -a -c -f package.zip templates settings.yaml theme.yaml README.md

ECHO Packaging complete: package.zip
pause
