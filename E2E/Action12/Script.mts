AIUtil.SetContext Browser("creationtime:=0")

''#########################################################################################################################
''DJ241112	S/4 HANA 2023 requires picking information to happen before outbound delivery document created, moved block of code from 
''	vl02n to vl01n.
'
'AIUtil("text_box", "Actual GI Date:").SetText FormatDateTime(Date, 2)
'AIUtil.FindTextBlock("Picking").Click
'
'XtoClick = (AIUtil.FindTextBlock("SLoc").GetObjectProperty ("width") /2)
'AIUtil.Context.Freeze
'YtoClick = (AIUtil.FindTextBlock("SLoc").GetObjectProperty ("y") - (AIUtil.FindTextBlock("1710").GetObjectProperty ("y") + (AIUtil.FindTextBlock("1710").GetObjectProperty ("height")/2))) * -1
''print "Click at " & XtoClick & ", " & YtoClick
'AIUtil.FindTextBlock("SLoc").Click XtoClick, YtoClick
''The below wait statement is to allow the application to register the click and make the cell editable
'wait 1
'set objSendKey=CreateObject("WScript.shell")
'
'''Storage location = 171A
''objSendKey.SendKeys "171A"
'objSendKey.SendKeys "171S"
'
'XtoClick = (AIUtil.FindTextBlock("Picked Qty").GetObjectProperty ("width") /2)
''print "Click at " & XtoClick & ", " & YtoClick
'AIUtil.FindTextBlock("Picked Qty").Click XtoClick, YtoClick
''The below wait statement is to allow the application to register the click and make the cell editable
'wait 1
'''PICKING QUANTITY = same value ordered
'objSendKey.SendKeys DataTable.Value("OrderQuantity", "05_va01_order_details")
'AIUtil.Context.UnFreeze
'
'AIUtil.FindTextBlock("Post Goods Issue").Click
'If AIUtil("check_mark").Exist(60) = FALSE Then
'	Reporter.ReportEvent micFail, "Delivery Number Creation", "The delivery number creation check mark status message didn't display within 60 seconds."
'End If
'AIUtil("check_mark").Click
'AIUtil.FindTextBlock("Outbound Delivery " & DataTable.Value("DeliveryNumber") & " has been saved").CheckExists True
'AIUtil.FindTextBlock("Exit").Click
'Set ResultsMessage = AIRegex("Results (\d+)")
'AIUtil.FindTextBlock(ResultsMessage).CheckExists True
'AIUtil("left_triangle").Click
'Browser("creationtime:=0").Sync																			'Wait for the browser to stop spinning
'
''DJ241112	End of move of code block brought forward
''#########################################################################################################################



AIUtil("button", "Save").Click
AIUtil("check_mark").CheckExists True
Set OutboundDeliveryMessage = AIRegex("Outbound Delivery \d+ has been saved")
'Set OutboundDeliveryMessage = AIRegex("Outbound Delivery \d+ was saved and distributed to the WMS")
'' 	SAP S/4 HANA 2023 changed the interface, there' no longer a pop-up window with a help link, now you have View Details link in the status bar
''AIUtil.FindTextBlock("Help").Click
'AIUtil.FindText("View Details").Click
'	Interface messaging text has changed, need to update here
If AIUtil.FindTextBlock(OutboundDeliveryMessage).Exist(0) Then
	print "Outbound delivery message displayed"
Else
	Set OutboundDeliveryMessage = AIRegex("Outbound Delivery \d+ has been saved")
	If AIUtil.FindTextBlock(OutboundDeliveryMessage).Exist(0) Then
		print "Outbound deliver message is just ...has been saved."	
	Else
		msgbox "No outbound delivery message detected on the pop-up page, inspect the application."
	End If
End If
AIUtil.FindTextBlock(OutboundDeliveryMessage).CheckExists True
DeliveryMessage = AIUtil.FindTextBlock(OutboundDeliveryMessage).GetText
DeliveryMessageArray = Split(DeliveryMessage," ")
DeliveryNumber = DeliveryMessageArray(2)
print "Delivery number is " & DeliveryMessageArray(2)
DataTable.Value("DeliveryNumber") = DeliveryMessageArray(2)
Parameter.Item("DeliveryNumber") = DeliveryMessageArray(2)
Reporter.ReportEvent micDone, "Delivery Number", "The Deliver Number from the popup window is " & DeliveryMessageArray(2) & "."

AIUtil("check_mark").Click
