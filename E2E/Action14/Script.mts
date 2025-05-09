﻿Dim counter

Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon
AIUtil.SetContext AppContext																'Tell the AI engine to point at the application

'AIUtil("search").Click
''	Search field text box label changed for S/4 HANA 2023 over 1909
''AIUtil("text_box", "Search").SetText "vl02n"
'AIUtil("text_box", micAnyText, micWithAnchorOnRight, AIUtil("search")).SetText "vl02n"
'AIUtil("search").Click
AIUtil("search").Search "vl02n"
AppContext.Sync																			'Wait for the browser to stop spinning

counter = 0
Do
	counter = counter + 1
	wait 1
	If counter >= 60 Then
		msgbox "The search returning the text Apps didn't display within " & counter & " attempts.  Check the application."
		ExitTest
	End If
Loop Until (AIUtil.FindTextBlock("Apps").Exist(0) or AIUtil.FindTextBlock("Apps",micFromTop, 1).Exist(0))
counter = 0
Do
	counter = counter + 1
	AIUtil.FindTextBlock("Change Outbound").Click
	If counter >= 60 Then
		msgbox "The Change Outbound text block isn't disappearing like it should, check application"
		ExitTest
	End If
Loop Until AIUtil.FindTextBlock("Change Outbound Delivery").Exist(10)

AIUtil.FindTextBlock("Change Outbound Delivery").CheckExists True

