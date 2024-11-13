Dim counter

Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon
AIUtil.SetContext AppContext																'Tell the AI engine to point at the application

'Sometimes the Fiori application isn't responsive enough to use the complex search statement, the entering of the value into the field overruns the app
'	turns out until the help icon is loaded (in Fiori), the search box doesn't actually function.  Added sync logic to 01_Login to wait for the help icon to show up
'	before marking login as complete
AIUtil("search").Search "va01"
'AIUtil("search").Click
''	Search field text box label changed for S/4 HANA 2023 over 1909
''AIUtil("text_box", "Search").SetText "va01"
'AIUtil.FindText("Search In:").Hover
'AIUtil("text_box", micAnyText, micWithAnchorOnRight, AIUtil("search")).SetText "va01"
'AIUtil("search").Click
AppContext.Sync																			'Wait for the browser to stop spinning
counter = 0
Do
	counter = counter + 1
	wait 1
	If counter >= 60 Then
		msgbox "The search returning the text Apps didn't display within " & counter & " attempts.  Check the application."
		ExitTest
	End If
Loop Until AIUtil.FindTextBlock("Apps").Exist
counter = 0
Do
	counter = counter + 1
	AIUtil.FindTextBlock("Create Sales Orders").Click
	If counter >= 60 Then
		msgbox "The Create Sales Order text block isn't disappearing like it should, check application"
		ExitTest
	End If
Loop Until AIUtil.FindTextBlock("Create Sales Documents").Exist(10)

AIUtil("text_box", "Order Type:").CheckExists True
