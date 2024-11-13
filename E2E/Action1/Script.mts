Dim BrowserExecutable, oShell, counter

Set oShell = CreateObject ("WSCript.shell")
oShell.run "powershell -command ""Start-Service mediaserver"""
Set oShell = Nothing

While Browser("CreationTime:=0").Exist(0)   													'Loop to close all open browsers
	Browser("CreationTime:=0").Close 
Wend
BrowserExecutable = DataTable.Value("BrowserName") & ".exe"
SystemUtil.Run BrowserExecutable,"","","",3												'launch the browser specified in the data table
Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon

AppContext.ClearCache																		'Clear the browser cache to ensure you're getting the latest forms from the application
AppContext.Navigate DataTable.Value("URL")												'Navigate to the application URL
AppContext.Maximize																		'Maximize the application to give the best chance that the fields will be visible on the screen
AppContext.Sync																			'Wait for the browser to stop spinning
AIUtil.SetContext AppContext																'Tell the AI engine to point at the application

AIUtil("text_box", "User").SetText "s4h_sd_dem"
AIUtil("text_box", "Password").SetText "Welcome1"
AIUtil("button", "Log On").Click
AppContext.Sync																			'Wait for the browser to stop spinning
WasEnabled = AIUtil.RunSettings.AutoScroll.IsEnabled
OrigDirection = AIUtil.RunSettings.AutoScroll.GetDirection
OrigMax = AIUtil.RunSettings.AutoScroll.GetMaxNumberOfScrolls
AIUtil.RunSettings.AutoScroll.Disable
counter = 0
Do
	counter = counter + 1
	wait 1
	If counter >= 60 Then
		msgbox "The help icon didn't show up within " & counter & " tries, check application."
		ExitTest
	End If
Loop Until AIUtil("help").Exist(0)

If WasEnabled Then
    AIUtil.RunSettings.AutoScroll.Enable OrigDirection, OrigMax
Else
    AIUtil.RunSettings.AutoScroll.Disable
End If

