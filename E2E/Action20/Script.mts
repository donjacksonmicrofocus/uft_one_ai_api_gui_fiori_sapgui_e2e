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

AIUtil.FindTextBlock("Document Date:").Click
AIUtil.Context.Freeze 
AIUtil("text_box", "Account:", micFromBottom, 1).SetText "EWM17-CU02"
AIUtil("text_box", "Amount").SetText "15"
AIUtil("text_box", "Account:", micFromTop, 1).SetText "11003000"
AIUtil("text_box", "", micWithAnchorOnLeft, AIUtil.FindTextBlock("House Bank:")).SetText "USAC3"
AIUtil("text_box", "House Bank:").SetText "USBD2"

TypeTextBox.SetText "DZ"

AIUtil("text_box", "Document Date:").SetText FormatDateTime(Date, 2)
AIUtil("button", "Post").Click
AIUtil.Context.Unfreeze
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

