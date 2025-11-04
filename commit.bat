@echo off
set /p message="Enter commit message: "
git add .
git commit -m "%message%"
echo Commit completed.
pause