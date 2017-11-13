var dimensionArray = localStorage.getItem("dimensionArray");
if (dimensionArray != undefined && dimensionArray != null) {
	dimensionArray = JSON.parse(dimensionArray);
}
else {
	var lengthArray = [[["meter(s)","cm(s)",100,0],["meter(s)","inches(s)",39.3701,0],["meter(s)","ft(s)",3.28084,0]],
				   [["meter(s)","cm(s)",100,0],["meter(s)","inches(s)",39.3701,0],["meter(s)","ft(s)",3.28084,0]]];
	var massArray = [[["kg","g",1000,0],["kg","pound",2.20462,0],["kg","ounce",35.274,0]]];
	dimensionArray = [['length',lengthArray],['mass',massArray]];
}

var sheetArray = localStorage.getItem("sheetArray");
if (sheetArray != undefined && sheetArray != null) {
	sheetArray = JSON.parse(sheetArray);
}
else {
	var sheetArray = [];
}

