Function SAPGUISetText (Object, Value, Label)
'DJ20250415	Update so that now the script passes in the findtext command of what the label.
	counter = 0
	Do
		counter = counter + 1
		Object.SetText Value
		Label.Click
		If counter >= 60 Then
			Reporter.ReportEvent micFail, "Set " & Object & " to " & Value & "", "Couldn't set the value after " & counter & " tries, aborting run."
			ExitAction
		End If
	Loop Until AIUtil.FindText(Value, micWithAnchorOnLeft, Label).Exist(0)
		
End Function

Function SetupPostIncomingPayments 
	AIUtil.FindTextBlock("Document Date:").Click
'	AIUtil.Context.Freeze 
	'AIUtil("text_box", "Account:", micFromBottom, 1).SetText "EWM17-CU02"
	SAPGUISetText AIUtil("text_box", "Account:", micFromBottom, 1), "EWM17-CU02", AIUtil.FindText("Account:", micFromBottom, 1)
'	SAPGUISetText AIUtil("text_box", "Account:", micFromBottom, 1), "EWM17-CU02", "Account:"
	'AIUtil("text_box", "Value date:").SetText "03/10/2024"
	SAPGUISetText AIUtil("text_box", "Value date:"), "03/10/2024", AIUtil.FindText("Value date:")
	'AIUtil("text_box", "Amount").SetText Parameter.Item("AmountAssigned")
	SAPGUISetText AIUtil("text_box", "Amount"), Parameter.Item("AmountAssigned"), AIUtil.FindTextBlock("Amount:")
	'AIUtil("text_box", "Account:", micFromTop, 1).SetText "11003000"
	'AIUtil("text_box", "Account:", micFromTop, 1).SetText "10010000"
	SAPGUISetText AIUtil("text_box", "Account:", micFromTop, 1), "11003000", AIUtil.FindText("Account:", micFromTop, 1)
	'AIUtil("text_box", "", micWithAnchorOnLeft, AIUtil.FindTextBlock("House Bank:")).SetText "USAC3"
	SAPGUISetText AIUtil("text_box", "", micWithAnchorOnLeft, AIUtil.FindTextBlock("House Bank:")), "USAC3", AIUtil.FindText("House Bank:")
	'AIUtil("text_box", "House Bank:").SetText "USBD2"
	SAPGUISetText AIUtil("text_box", "House Bank:"), "USBD2", AIUtil.FindText("House Bank:")
		
	'AIUtil("text_box", "Period:").SetText "03"
	SAPGUISetText AIUtil("text_box", "Period:"), "03",  AIUtil.FindText("Period:")
	'AIUtil("text_box", "Posting Date:").SetText "03/10/2024"
	SAPGUISetText AIUtil("text_box", "Posting Date:"), "03/10/2024", AIUtil.FindText("Posting Date:")
	'AIUtil("text_box", "Company Code:").SetText "1710"
	SAPGUISetText AIUtil("text_box", "Company Code:"), "1710", AIUtil.FindText("Company Code:")
	'AIUtil("text_box", "Document Date:").SetText FormatDateTime(Date, 2)
	
	'TypeTextBox.SetText "DZ"
'	SAPGUISetText TypeTextBox, "DZ", AIUtil.FindText(TypeTextBox)
	'AIUtil("text_box", "Document Date:").SetText "03/10/2024"
	SAPGUISetText AIUtil("text_box", "Document Date:"), "03/10/2024", AIUtil.FindText("Document Date:")
	AIUtil("button", "Post").Click
'	AIUtil.Context.Unfreeze
	
End Function

If Parameter.Item("FioriOrGUI") = "Fiori" Then
	Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon
	AIUtil.SetContext AppContext																'Tell the AI engine to point at the application
	Set TypeTextBox = AIUtil("text_box", "Type")
ElseIf Parameter.Item("FioriOrGUI") = "GUI" Then
	Set AppContext = SAPGuiSession("micclass:=SAPGuiSession")
	AIUtil.SetContext AppContext																'Tell the AI engine to point at the application
	
	Set TypeTextBox = AIUtil("text_box", "Type: *")
Else
	msgbox "Value not handled"
End If
AIUtil.RunSettings.OCR.UseConfigSet UFT_OCR
SetupPostIncomingPayments
AIUtil.RunSettings.OCR.UseConfigSet AI_OCR
'Set AppContext = SAPGuiSession("micclass:=SAPGuiSession")
'AIUtil.SetContext AppContext
'
If AIUtil.FindText("previous fiscal year").Exist(5) Then
	AIUtil.FindText("previous fiscal year").CheckExists True
	If Parameter.Item("FioriOrGUI") = "Fiori" Then
		AIUtil("text_box", "Document Date:").Click
		Set WshShell = CreateObject("WScript.Shell")
	    	Wait(1)
	    	WshShell.SendKeys "{ENTER}"
	    	Set WshShell = Nothing
	ElseIf Parameter.Item("FioriOrGUI") = "GUI" Then
		SAPGuiSession("Session").SAPGuiWindow("Post Incoming Payments:").SendKey ENTER @@ hightlight id_;_0_;_script infofile_;_ZIP::ssf1.xml_;_
	End If

End If

If AIUtil.FindText("too large for clearing").Exist(15) Then
	If Parameter.Item("FioriOrGUI") = "Fiori" Then
		Set WshShell = CreateObject("WScript.Shell")
		Wait(1)
		WshShell.SendKeys "+{F4}"
	    	Set WshShell = Nothing
	ElseIf Parameter.Item("FioriOrGUI") = "GUI" Then
		AIUtil.FindTextBlock("15.00", micFromTop, 1).DoubleClick
	End If
End If

'SAP S/4HANA 2020 (1909) code to get to the status message that sometimes doesn't appear
'If Parameter.Item("FioriOrGUI") = "Fiori" Then
'	AIUtil.FindTextBlock("Help").Click
'End If
AIUtil.RunSettings.OCR.UseConfigSet UFT_OCR
Set DocumentConfirmationMessage = AIRegex("Document \d+ was posted in company code \d+")
Do
 	If AIUtil("button", "Post").Exist(0) Then
	 	AIUtil("button", "Post").Click
	 Else
	 	Exit Do
 	End If
Loop Until AIUtil.FindTextBlock(DocumentConfirmationMessage).Exist(0)

AIUtil.FindTextBlock(DocumentConfirmationMessage).CheckExists True
DocumentMessage = AIUtil.FindTextBlock(DocumentConfirmationMessage).GetText
DocumentMessageArray = Split(DocumentMessage," ")
DocumentNumber = DocumentMessageArray(1)
print "Document Number is " & DocumentMessageArray(1)
DataTable.Value("DocumentNumber") = DocumentMessageArray(1)
Parameter.Item("DocumentNumber") = DocumentMessageArray(1)
Reporter.ReportEvent micDone, "Document Number", "The Deliver Number from the popup window is " & DocumentMessageArray(1) & "."
AIUtil.RunSettings.OCR.UseConfigSet AI_OCR

If Parameter.Item("FioriOrGUI") = "Fiori" Then
	AIUtil("check_mark").Click
	AIUtil.FindTextBlock("Exit").Click
	Set ResultsMessage = AIRegex("Results (\d+)")
	AIUtil.FindTextBlock(ResultsMessage).CheckExists True
	AIUtil("left_triangle").Click
	Browser("creationtime:=0").Sync																			'Wait for the browser to stop spinning
	RunAction "99_logout", oneIteration
ElseIf Parameter.Item("FioriOrGUI") = "GUI" Then
	AIUtil.FindTextBlock("Exit").Click
	AIUtil("button", "Yes").Click
	AIUtil.FindTextBlock("Exit").Click
	AIUtil("button", "Yes").Click
Else
	msgbox "Value not handled"
End If

