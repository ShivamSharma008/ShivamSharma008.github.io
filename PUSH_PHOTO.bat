@echo off
cd /d C:\mp-omr-athena-application-engineering\shivam-portfolio-live
echo Adding files to git...
git add .
echo.
echo Committing changes...
git commit -m "Add profile photo to portfolio"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo Done! Check your portfolio at https://shivamsharma008.github.io
pause

