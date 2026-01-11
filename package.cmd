@echo off
ECHO Preparing to package theme...

REM Delete existing theme.zip if exists
if exist "theme.zip" (
    ECHO Found existing theme.zip, deleting...
    del "theme.zip"
)

ECHO Building frontend assets...
call npm run build

ECHO Creating theme.zip with tar...
REM -a (auto-detect format by extension .zip)
REM -c (create archive)
REM -f (specify filename)
tar.exe -a -c -f theme.zip templates settings.yaml theme.yaml README.md annotation-setting.yaml

ECHO Done: theme.zip
