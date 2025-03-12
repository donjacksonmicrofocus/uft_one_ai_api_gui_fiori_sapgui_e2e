Set AppContext=Browser("CreationTime:=0")												'Set the variable for what application (in this case the browser) we are acting upon
AIUtil.SetContext AppContext																'Tell the AI engine to point at the application

If Parameter.Item("DeliveryNumber") = "Default" Then
	Parameter.Item("DeliveryNumber") = DataTable.Value("DeliveryNumber")
End If

'AIUtil("text_box", "Actual GI Date:").SetText FormatDateTime(Date, 2)
If AIUtil("text_box", "Actual Gl Date:").Exist(0) Then
	AIUtil("text_box", "Actual GI Date:").SetText "03/30/2024"
ElseIf AIUtil("input", "Actual Gl Date").Exist(0) Then
	AIUtil("input", "Actual Gl Date").SetText "03/30/2024"
Else
	msgbox "Can't find the Actual Gl Date field"
End If
AIUtil.FindTextBlock("Picking").Click

XtoClick = (AIUtil.FindTextBlock("SLoc").GetObjectProperty ("width") /2)
AIUtil.Context.Freeze
YtoClick = (AIUtil.FindTextBlock("SLoc").GetObjectProperty ("y") - (AIUtil.FindTextBlock("1710").GetObjectProperty ("y") + (AIUtil.FindTextBlock("1710").GetObjectProperty ("height")/2))) * -1
'print "Click at " & XtoClick & ", " & YtoClick
AIUtil.FindTextBlock("SLoc").Click XtoClick, YtoClick
'The below wait statement is to allow the application to register the click and make the cell editable
wait 1
set objSendKey=CreateObject("WScript.shell")

''Storage location = 171A
objSendKey.SendKeys "171A"

XtoClick = (AIUtil.FindTextBlock("Picked Qty").GetObjectProperty ("width") /2)
'print "Click at " & XtoClick & ", " & YtoClick
AIUtil.FindTextBlock("Picked Qty").Click XtoClick, YtoClick
'The below wait statement is to allow the application to register the click and make the cell editable
wait 1
''PICKING QUANTITY = same value ordered
objSendKey.SendKeys DataTable.Value("OrderQuantity", "05_va01_order_details")
AIUtil.Context.UnFreeze

AIUtil.FindTextBlock("Post Goods Issue").Click
If AIUtil("check_mark").Exist(60) = FALSE Then
	Reporter.ReportEvent micFail, "Delivery Number Creation", "The delivery number creation check mark status message didn't display within 60 seconds."
End If
AIUtil("check_mark").Click
'DJ241112	S/4 HANA 2023 says "Outbound Delivery <DeliveryNumber> saved, material document <MaterialDocumentID> created"
'AIUtil.FindTextBlock("Outbound Delivery " & DataTable.Value("DeliveryNumber") & " has been saved").CheckExists True
AIUtil.FindText("Outbound Delivery " & DataTable.Value("DeliveryNumber") & " saved").CheckExists True
AIUtil.FindTextBlock("Exit").Click
Set ResultsMessage = AIRegex("Results (\d+)")
AIUtil.FindTextBlock(ResultsMessage).CheckExists True
AIUtil("left_triangle").Click
Browser("creationtime:=0").Sync																			'Wait for the browser to stop spinning

