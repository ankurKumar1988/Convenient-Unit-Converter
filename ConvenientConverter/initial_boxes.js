var dimensionArray;
//dimensionArray = localStorage.getItem("dimensionArray");
if (dimensionArray != undefined && dimensionArray != null) {
	dimensionArray = JSON.parse(dimensionArray);
}
else {
	var ASUArray = [[["cubic ft (NTP)","scf (60F, 14.696 psia)",0.98112,0],["cubic ft (NTP)","g.mol",1.1727,0],["Btu","J",1054.4,0]],
					[["Btu","cal(g)",252,0]]];
	var lengthArray = [[["cm(s)","inch(es)",0.3937,0],["meter(s)","inch(es)",39.3701,0],["meter(s)","ft(s)",3.28084,0]],
				   [["mile(s)","km(s)",1.6093,0],["meter(s)","yard(s)",1.0936,0],["Nautical mile(s)","km(s)",1.852,0]],
				   [["Nautical mile(s)","mile(s)",1.1507,0],["mile(s)","ft(s)",5280,0]]];
	var massArray = [[["kg","pound",2.20462,0],["kg","ounce",35.274,0],["metric ton","kg",1000,0]],
					 [["ounce","g",28.3495,0],["pound","g",453.5929,0]]];
	var pressureArray = [[["atm","bar",1.01325,0],["atm","Pa",101325,0],["atm","psi",14.6959,0]],
					 [["atm","atm(g)",1,-1],["KPa","psi",0.145,0],["KPa(g)","psi(g)",0.145,0]]];
	var customArray = [];				 
	dimensionArray = [['ASU',ASUArray],['length',lengthArray],['mass',massArray],['pressure',pressureArray],['custom',customArray]];
}

localStorage.setItem("dimensionArray", JSON.stringify(dimensionArray));

var sheetArray = localStorage.getItem("sheetArray");
if (sheetArray != undefined && sheetArray != null) {
	sheetArray = JSON.parse(sheetArray);
}
else {
	var sheetArray = [];
}

