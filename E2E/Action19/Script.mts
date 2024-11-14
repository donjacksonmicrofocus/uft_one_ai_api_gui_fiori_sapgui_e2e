Dim counter

If Parameter.Item("FioriOrGUI") = "Fiori" Then
	Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon
	AIUtil.SetContext AppContext																'Tell the AI engine to point at the application
	RunAction "01_Login", oneIteration

'	AIUtil("search").Click
'	'	Search field text box label changed for S/4 HANA 2023 over 1909
'	'AIUtil("text_box", "Search").SetText "post incoming payments"
'	AIUtil("text_box", micAnyText, micWithAnchorOnRight, AIUtil("search")).SetText "post incoming payments"
'	AIUtil("search").Click
	AIUtil("search").Search "post incoming payments"
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
		AIUtil.FindTextBlock("For Customers").Click
		If counter >= 60 Then
			msgbox "The Post Incoming Payments: Header Data text block isn't disappearing like it should, check application"
			ExitTest
		End If
Loop Until AIUtil.FindTextBlock("Post Incoming Payments: Header Data").Exist(10)

ElseIf Parameter.Item("FioriOrGUI") = "GUI" Then
'	SAPGuiUtil.AutoLogon "S/4HANA 2020 FPS01", "100", "s4h_sd_dem", "Welcome1", "EN"
	SAPGuiUtil.AutoLogon "S4H (S/4 Hana 2023)", "100", "s4h_sd_dem", "Welcome1", "EN"
	AIUtil.SetContext SAPGuiSession("micclass:=SAPGuiSession")
			
	SAPGuiSession("Session").SAPGuiWindow("SAP Easy Access").Maximize @@ hightlight id_;_0_;_script infofile_;_ZIP::ssf1.xml_;_
	SAPGuiSession("Session").SAPGuiWindow("SAP Easy Access").SAPGuiOKCode("OKCode").Set "/nf-28" @@ hightlight id_;_1_;_script infofile_;_ZIP::ssf1.xml_;_
	SAPGuiSession("Session").SAPGuiWindow("SAP Easy Access").SendKey ENTER @@ hightlight id_;_0_;_script infofile_;_ZIP::ssf1.xml_;_
	
Else
	msgbox "Value not handled"
End If

AIUtil.FindTextBlock("Post Incoming Payments: Header Data").CheckExists True

