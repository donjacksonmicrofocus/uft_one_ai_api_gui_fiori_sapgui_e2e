Dim oShell

Set oShell = CreateObject ("WSCript.shell")
oShell.run "powershell -command ""Start-Service mediaserver"""
Set oShell = Nothing

AIUtil.RunSettings.OCR.UseConfigSet AI_OCR
SystemUtil.Run "C:\Program Files (x86)\OpenText\UFT One\samples\Flights Application\FlightsAPI.exe"

AIUtil.SetContext WpfWindow("wpftypename:=window", "regexpwndtitle:=OpenText Flights Service APIs", "devname:=OpenText Flights Service APIs")

AIUtil.FindTextBlock("The OpenText Flights service is running").Hover
AIUtil.FindTextBlock("The OpenText Flights service is running").CheckExists True
'dj241112	Converted to relative pathing for the API test call
'RunAPITest "FlightsAPI1_1" ,Parameter("APIOrderNum"),Parameter("APIFlightNum"),Parameter("APIAirline")
'RunAPITest "FlightsAPI1" ,Parameter("APIOrderNum"),Parameter("APIFlightNum"),Parameter("APIAirline")
RunAPITest "FlightsAPI1" ,Parameter("APIOrderNum"),Parameter("APIFlightNum"),Parameter("APIAirline")


DataTable.Value("APIOrderNum") = Parameter("APIOrderNum")
DataTable.Value("APIFlightNum") = Parameter("APIFlightNum")
DataTable.Value("APIAirline") = Parameter("APIAirline")

print "The Order Number created by the API test is " & DataTable.Value("APIOrderNum")
print "The Flight Number used to create the order by the API test is " & DataTable.Value("APIFlightNum")
print "The Airline used to create the order by the API test is " & DataTable.Value("APIAirline")

AIUtil("close").Click
'msgbox DataTable.Value("APIOrderNum") & ", " & DataTable.Value("APIFlightNum") & ", " & DataTable.Value("APIAirline")

