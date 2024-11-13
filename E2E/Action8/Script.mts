Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon
AIUtil.FindTextBlock("SS").Click
AIUtil.SetContext AppContext																'Tell the AI engine to point at the application
'	SAP no longer had the profile icon on the profile button, but the initials of the user instead in SAP S/4 2023
'AIUtil("profile").Click
WasEnabled = AIUtil.RunSettings.AutoScroll.IsEnabled
OrigDirection = AIUtil.RunSettings.AutoScroll.GetDirection
OrigMax = AIUtil.RunSettings.AutoScroll.GetMaxNumberOfScrolls
AIUtil.RunSettings.AutoScroll.Disable
counter = 0
Do
	AIUtil.FindTextBlock("SS").Click
	counter = counter + 1
	If counter >= 60 Then
		reporter.ReportEvent micFail, "Bring Up Profile Menu", "The logoff button isn't displaying after clicking on the profile icon " & counter & " times."
		ExitAction
	End If
Loop Until AIUtil("power").Exist(0)
AIUtil("power").Click

If WasEnabled Then
    AIUtil.RunSettings.AutoScroll.Enable OrigDirection, OrigMax
Else
    AIUtil.RunSettings.AutoScroll.Disable
End If

AIUtil.FindText("Sign Out").Click
AIUtil.FindTextBlock("OK").Click
AppContext.Close																			'Close the application at the end of your script
