Function SAPGUISetText (Object, Value, Label)
'	counter = 0
'	Do
'		counter = counter + 1
		Object.SetText Value
'		AIUtil.FindTextBlock("Clearing Text:").Click
''		CurrentValue = Object.GetValue
''		msgbox "Comparing CurrentValue = " & CurrentValue & " and Value = " & Value
'		msgbox "AIUtil.FindText(Value, micWithAnchorOnLeft, AIUtil.FindText(Label)).Exist(0) returns " & AIUtil.FindText(Value, micWithAnchorOnLeft, AIUtil.FindText(Label)).Exist(0)
'		If counter >= 60 Then
'			Reporter.ReportEvent micFail, "Set " & Object & " to " & Value, "Couldn't set the value after " & counter & " tries, aborting run."
'			ExitAction
'		End If
''	Loop Until CurrentValue = Value
'	Loop Until AIUtil.FindText(Value, micWithAnchorOnLeft, AIUtil.FindText(Label)).Exist(0)
		
End Function

Function SetupPostIncomingPayments 
	AIUtil.FindTextBlock("Document Date:").Click
	AIUtil.Context.Freeze 
	'AIUtil("text_box", "Account:", micFromBottom, 1).SetText "EWM17-CU02"
	SAPGUISetText AIUtil("text_box", "Account:", micFromBottom, 1), "EWM17-CU02", "Account:"
	'AIUtil("text_box", "Value date:").SetText "03/10/2024"
	SAPGUISetText AIUtil("text_box", "Value date:"), "03/10/2024", "Value date:"
	'AIUtil("text_box", "Amount").SetText Parameter.Item("AmountAssigned")
	SAPGUISetText AIUtil("text_box", "Amount"), Parameter.Item("AmountAssigned"), "Amount"
	'AIUtil("text_box", "Account:", micFromTop, 1).SetText "11003000"
	'AIUtil("text_box", "Account:", micFromTop, 1).SetText "10010000"
	SAPGUISetText AIUtil("text_box", "Account:", micFromTop, 1), "11003000", "Account:"
	'AIUtil("text_box", "", micWithAnchorOnLeft, AIUtil.FindTextBlock("House Bank:")).SetText "USAC3"
	SAPGUISetText AIUtil("text_box", "", micWithAnchorOnLeft, AIUtil.FindTextBlock("House Bank:")), "USAC3", "House Bank:"
	'AIUtil("text_box", "House Bank:").SetText "USBD2"
	SAPGUISetTExt AIUtil("text_box", "House Bank:"), "USBD2", "House Bank:"
		
	'AIUtil("text_box", "Period:").SetText "03"
	SAPGUISetText AIUtil("text_box", "Period:"), "03",  "Period:"
	'AIUtil("text_box", "Posting Date:").SetText "03/10/2024"
	SAPGUISetText AIUtil("text_box", "Posting Date:"), "03/10/2024", "Posting Date:"
	'AIUtil("text_box", "Company Code:").SetText "1710"
	SAPGUISetText AIUtil("text_box", "Company Code:"), "1710", "Company Code:"
	'AIUtil("text_box", "Document Date:").SetText FormatDateTime(Date, 2)
	
	'TypeTextBox.SetText "DZ"
	SAPGUISetText TypeTextBox, "DZ", TypeTextBox
	'AIUtil("text_box", "Document Date:").SetText "03/10/2024"
	SAPGUISetText AIUtil("text_box", "Document Date:"), "03/10/2024", "Document Date:"
	AIUtil("button", "Post").Click
	AIUtil.Context.Unfreeze
	
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

SetupPostIncomingPayments
'Set AppContext = SAPGuiSession("micclass:=SAPGuiSession")
'AIUtil.SetContext AppContext
'
If AIUtil.FindText("Posting takes place in previous fiscal year").Exist(5) Then
	AIUtil.FindText("Posting takes place in previous fiscal year").CheckExists True
'	AIUtil.FindText("Document Date: *").Type micReturn
	SAPGuiSession("Session").SAPGuiWindow("Post Incoming Payments:").SendKey ENTER @@ hightlight id_;_0_;_script infofile_;_ZIP::ssf1.xml_;_
'	set objSendKey=CreateObject("WScript.shell")
'	wait 1
'	objSendKey.SendKeys "{ENTER}"
	
End If

If AIUtil.FindText("The difference is too large for clearing").Exist(0) Then
 @@ hightlight id_;_0_;_script infofile_;_ZIP::ssf1.xml_;_
	
	AIUtil.FindTextBlock("15.00", micFromTop, 1).DoubleClick
	AIUtil("button", "Post").Click
	
'	Parameter.Item("AmountAssigned") = AIUtil("text_box", "Assigned").GetValue
'	Parameter.Item("AmountAssigned") = Replace(Parameter.Item("AmountAssigned"), " ", "")
'	AIUtil.FindText("Processing Status").Click
'	AIUtil.FindTextBlock("Cancel").Click
'	AIUtil.FindTextBlock("Other line item").Click
'	AIUtil.FindTextBlock("Cancel").Click
'	AIUtil("button", "Yes").Click
'	SetupPostIncomingPayments
End If

If Parameter.Item("FioriOrGUI") = "Fiori" Then
	AIUtil.FindTextBlock("Help").Click
End If
AIUtil.RunSettings.OCR.UseConfigSet UFT_OCR
Set DocumentConfirmationMessage = AIRegex("Document \d+ was posted in company code \d+")
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

