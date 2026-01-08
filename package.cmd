@echo off
ECHO 正在准备压缩...

REM 检查旧文件，如果存在则删除 (实现 "覆盖" 效果)
if exist "theme.zip" (
    ECHO 发现已存在的 theme.zip，正在删除...
    del "theme.zip"
)

ECHO 正在构建前端资源...
call npm run build

ECHO 正在使用 tar 压缩文件...
REM -a (自动根据扩展名 .zip 选择压缩格式)
REM -c (创建 Create)
REM -f (指定文件名 File)
tar.exe -a -c -f theme.zip templates settings.yaml theme.yaml README.md annotation-setting.yaml

ECHO 压缩完成: theme.zip