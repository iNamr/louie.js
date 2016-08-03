@echo off

set NODE_VER=null
node -v >tmp.txt
set /p NODE_VER=<tmp.txt
del tmp.txt
IF %NODE_VER% EQU null (
	echo Please install node.js
  pause
	exit
	)
) ELSE (
	echo Ready to launch bot
	cls
	node run.js
	pause
)
