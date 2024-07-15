
SystemUtil.Run "C:\Program Files (x86)\OpenText\UFT One\samples\Flights Application\FlightsAPI.exe"

AIUtil.SetContext WpfWindow("wpftypename:=window", "regexpwndtitle:=OpenText Flights Service APIs", "devname:=OpenText Flights Service APIs")
AIUtil.FindTextBlock("The OpenText Flights service is running").CheckExists True
'RunAPITest "FlightsAPI1" ,APIOrderNum,APIFlightNum,APIAirline
RunAPITest "FlightsAPI1" ,DataTable.Value("APIOrderNum"),DataTable.Value("APIFlightNum"),DataTable.Value("APIAirline")

AIUtil("close").Click
'msgbox DataTable.Value("APIOrderNum") & ", " & DataTable.Value("APIFlightNum") & ", " & DataTable.Value("APIAirline")

