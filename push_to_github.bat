@echo off
echo Uploading GITAMW Autonomous LMS Portal to GitHub (SusmithaReddy-526)...
git remote remove origin
git remote add origin https://github.com/SusmithaReddy-526/gitamw-lms-portal.git
git branch -M main
git push -u origin main
echo.
echo Upload completed successfully!
pause
