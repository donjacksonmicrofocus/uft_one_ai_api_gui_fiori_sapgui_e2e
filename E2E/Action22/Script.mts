SystemUtil.Run "C:\Program Files (x86)\OpenText\UFT One\samples\Flights Application\FlightsGUI.exe"

AIUtil.SetContext WpfWindow("wpftypename:=window", "regexpwndtitle:=OpenText MyFlight Sample Application", "devname:=OpenText MyFlight Sample Application")
AIUtil("text_box", "Username").SetText "john"
AIUtil("text_box", "Password").SetText "HP"
AIUtil("button", "OK").Click
AIUtil.SetContext WpfWindow("wpftypename:=window", "regexpwndtitle:=OpenText MyFlight Sample Application", "devname:=OpenText MyFlight Sample Application")
AIUtil.FindTextBlock("SEARCH ORDER").Click
AIUtil("radio_button", micAnyText, micFromBottom, 1).SetState "On"

'DJ241115	Updated as the 24.4 AIOD model properly recognizes the field label, but wanted to make sure it should still work in 24.2.
'AIUtil("text_box", "TF an").SetText DataTable.Value("APIOrderNum")
AIUtil("text_box", micAnyText, micWithAnchorBelow, AIUtil("button", "SEARCH")).SetText DataTable.Value("APIOrderNum")

AIUtil("button", "SEARCH").Click
FlightPlusAirlineTextBlock = DataTable.Value("APIFlightNum") & " " & DataTable.Value("APIAirline")
AIUtil.FindTextBlock(FlightPlusAirlineTextBlock).CheckExists True
AIUtil("button", "NEW SEARCH").Click
AIUtil("close").Click
