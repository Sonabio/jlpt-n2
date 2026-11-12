@echo off
REM Bam dup de chay thu app tren may: mo http://localhost:8080
cd /d "%~dp0"
start "" http://localhost:8080
node tools\serve.js
