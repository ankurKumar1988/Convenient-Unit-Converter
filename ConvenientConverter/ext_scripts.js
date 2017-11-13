function saveSheet(){
	var list_items = $('#sortable').children(); var liID; var arrayPos;
	var sheetArraySave = [];
	var sheetValArraySave = [];
	var val1; var val2;
	// generate array data to save
	for (i=0; i < list_items.length; i++){
		liID = list_items[i].id;
		arrayPos = liID.substring(5,liID.length);
		sheetArraySave.push(sheetArray[arrayPos-1]);
		val1 = $('#'+liID+' #input1').val();
		val2 = $('#'+liID+' #input2').val();
		sheetValArraySave.push([val1,val2]);
	}
	sheetSave = JSON.stringify([sheetArraySave,sheetValArraySave]);
	// open save dialog box
	// for IE
	if (window.navigator.userAgent.indexOf(".NET") > 0) {
		blob = new Blob([sheetSave]);
		window.navigator.msSaveBlob(blob, 'myConversionSheet.json');
	}
	// for non-IE
	else {
		var encodedUri = encodeURI("data:text/json;charset=utf-8,"+sheetSave);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", 'myConversionSheet.json');
		document.body.appendChild(link); // Required for FF
		link.click(); // This will download the data file 
		document.body.removeChild(link);
	}    
}

function loadSheet(){
	document.querySelector('input#fileload').click();
}

function parseSheet(){
	file = document.querySelector('input#fileload').files[0];
	var reader = new FileReader();
	reader.onload = function(progressEvent){sheetArray = JSON.parse(reader.result)[0]; valArray = JSON.parse(reader.result)[1]; generateSheetBoxes(sheetArray,valArray);$('#fileload').val("");};
	reader.readAsText(file);
}

function generateBoxes(){
	var rowAppended, appendData, unitID;
	for (k=0; k < dimensionArray.length; k++){
		dimName = dimensionArray[k][0];
		dimArray = dimensionArray[k][1];
		for (i=0; i < dimArray.length; i++){
			rowAppended = $('<div class="row" id="row'+(i+1)+'"></div>').appendTo('#'+dimName+' #boxes');
			for (j=0; j < dimArray[i].length; j++){
				unitID = dimName+(i+1)+(j+1);
				appendData = '<div class="col-sm-4 unit" id="'+unitID+'">'+
								'<div class="cellInputLabel">'+
									'<input type="number" step="any" class="cellInput" id="input1" onkeypress="convert(event,'+k+','+(i+1)+','+(j+1)+',1)" onblur="convert(event,'+k+','+(i+1)+','+(j+1)+',1)"><br>'+
									'<label class="cellLabel">'+dimArray[i][j][0]+'</label>'+
								'</div>'+
								'<div class="cellEqual">=<br>&nbsp</div>'+
								'<div class="cellInputLabel">'+
									'<input type="number" step="any" class="cellInput" id="input2" onkeypress="convert(event,'+k+','+(i+1)+','+(j+1)+',2)" onblur="convert(event,'+k+','+(i+1)+','+(j+1)+',2)"><br>'+
									'<label class="cellLabel">'+dimArray[i][j][1]+'</label>'+
								'</div>'+
								'<button  type="button" class="btn btn-warning uploadButton" onclick="uploadToSheet('+k+','+(i+1)+','+(j+1)+')">'+
									'<span class="glyphicon glyphicon-arrow-up"></span>'+
								'</button>'+
							'</div>';
				$(appendData).appendTo(rowAppended);
			}
		}
		$('<hr style="margin-top: 7px; border-color: #333;">').appendTo('#'+dimName);
		
		// Add custom field input from User
		appendData = '<input class="userLabel" type="text" id="userlabel1" placeholder="Enter dimension 1 name">'+
		             ' = <input type="number" id="usermultiplier" placeholder="Enter multiplier" style="text-align: center;">'+
					 ' * <input class="userLabel" type="text" id="userlabel2" placeholder="Enter dimension 2 name">'+
					 ' + <input type="number" id="userconstant" placeholder="Enter constant" style="text-align: center;">'+
					 '  <button type="button" class="btn" onclick="addToList('+k+')">Click to add to list</button>';
		$(appendData).appendTo('#'+dimName);
	}
}

function generateSheetBoxes(sheetArray,valArray){
	// remove all existing boxes
	$("#sortable").empty();
	var appendData;
	for (i=0; i < sheetArray.length; i++){
		appendData = '<li id="sheet'+(i+1)+'">'+ 
						'<div class="unit" style="display:inline-block;">'+
							'<div class="cellInputLabel">'+
								'<input type="number" step = "any" class="cellInput" id="input1" onkeypress="convert(event,-1,1,'+(i+1)+',1)" onblur="convert(event,-1,1,'+(i+1)+',1)"><br>'+
								'<label style="display:inline-block;" class="cellLabel">'+sheetArray[i][0]+'</label>'+
							'</div>'+
							'<div class="cellEqual">=<br> &nbsp </div>'+
							'<div class="cellInputLabel">'+
								'<input type="number" step="any" class="cellInput" id="input2" onkeypress="convert(event,-1,1,'+(i+1)+',2)" onblur="convert(event,-1,1,'+(i+1)+',2)"><br>'+
								'<label style="display:inline-block;" class="cellLabel">'+sheetArray[i][1]+'</label>'+
							'</div>'+
							'<button  type="button" class="btn btn-danger cancelButton" onclick="deleteFromSheet('+(i+1)+')">'+
								'<span class="glyphicon glyphicon-remove"></span>'+
							'</button>'+
						'</div>'+
					'</li>'
		
		$(appendData).appendTo('#sortable');
		$("#sheet"+(i+1)+" #input1").val(valArray[i][0]);
		$("#sheet"+(i+1)+" #input2").val(valArray[i][1]);
	}
}

function uploadToSheet(dimension,row,column){
	// find number of li items
	var list_items = $('#sortable').children();
	nlist_items = list_items.length;
	
	var unitArray = dimensionArray[dimension][1][row-1][column-1];
	var unitID = dimensionArray[dimension][0]+row+column;
	var val1 = $("#"+unitID+" #input1").val();
	var val2 = $("#"+unitID+" #input2").val();
	// append new array to sheetArray
	sheetArray.push([unitArray[0],unitArray[1],unitArray[2],unitArray[3]]);
	// append new list item
	var appendData = '<li id="sheet'+(nlist_items+1)+'">'+ 
					'<div class="unit" style="display:inline-block;">'+
						'<div class="cellInputLabel">'+
							'<input type="number" step = "any" class="cellInput" id="input1" onkeypress="convert(event,-1,1,'+(nlist_items+1)+',1)" onblur="convert(event,-1,1,'+(nlist_items+1)+',1)"><br>'+
							'<label style="display:inline-block;" class="cellLabel">'+unitArray[0]+'</label>'+
						'</div>'+
						'<div class="cellEqual">=<br> &nbsp </div>'+
						'<div class="cellInputLabel">'+
							'<input type="number" step="any" class="cellInput" id="input2" onkeypress="convert(event,-1,1,'+(nlist_items+1)+',2)" onblur="convert(event,-1,1,'+(nlist_items+1)+',2)"><br>'+
							'<label style="display:inline-block;" class="cellLabel">'+unitArray[1]+'</label>'+
						'</div>'+
						'<button  type="button" class="btn btn-danger cancelButton" onclick="deleteFromSheet('+(i+1)+')">'+
							'<span class="glyphicon glyphicon-remove"></span>'+
						'</button>'+
					'</div>'+
				'</li>'
	
	$(appendData).appendTo('#sortable');
	$("#sheet"+(nlist_items+1)+" #input1").val(val1);
	$("#sheet"+(nlist_items+1)+" #input2").val(val2);
}

function deleteFromSheet(liPos){
	$('#sortable #sheet'+liPos).remove();
}

function addToList(dimension){
	var blockID = '#'+dimensionArray[dimension][0];
	var userlabel1 = $(blockID+' #userlabel1').val(); var userlabel2 = $(blockID+' #userlabel2').val();
	var usermultiplier = $(blockID+' #usermultiplier').val(); var userconstant = $(blockID+' #userconstant').val();
	
	// check data consistency
	if (usermultiplier == 0 && usermultiplier != "") {alert('0 as multiplier is not allowed'); return;}
	if (userlabel1 == "" || userlabel2 == "" || usermultiplier == "" || userconstant == "") {
		alert('Please provide complete information');
	}
	else {
		var dimArray = dimensionArray[dimension][1];
		var n_row = dimArray.length; 
		var n_lastrow_col = dimArray[dimArray.length-1].length;
		// decide position of new unit in box grid
		if (n_lastrow_col % 3 == 0) {
			row = n_row + 1; col = 1;
			dimArray.push([[userlabel1,userlabel2,1/usermultiplier,-userconstant/usermultiplier]]);
		} 
		else {
			row = n_row; col = n_lastrow_col + 1;
			dimArray[dimArray.length-1].push([userlabel1,userlabel2,1/usermultiplier,-userconstant/usermultiplier]);
		}
		// create appropriate unit html
		var appendData = '<div class="col-sm-4 unit" id="'+dimensionArray[dimension][0]+row+col+'">'+
							'<div class="cellInputLabel">'+
								'<input type="number" step="any" class="cellInput" id="input1" onkeypress="convert(event,'+dimension+','+row+','+col+',1)" onblur="convert(event,'+dimension+','+row+','+col+',1)"><br>'+
								'<label class="cellLabel">'+userlabel1+'</label>'+
							'</div>'+
							'<div class="cellEqual">=<br>&nbsp</div>'+
							'<div class="cellInputLabel">'+
								'<input type="number" step="any" class="cellInput" id="input2" onkeypress="convert(event,'+dimension+','+row+','+col+',2)" onblur="convert(event,'+dimension+','+row+','+col+',2)"><br>'+
								'<label class="cellLabel">'+userlabel2+'</label>'+
							'</div>'+
						'</div>';
		// decide if new row class is needed
		if (col == 1) {
			appendData = '<div class="row">' + appendData + '</div>'
			$(appendData).appendTo(blockID+' #boxes');
		}
		else {
			$(appendData).appendTo(blockID+' #boxes #row' + n_row);
		}
		// save new dimensionArray to local storage
		localStorage.setItem("dimensionArray", JSON.stringify(dimensionArray));
	}
}

function convert(event,dimension,row,column,posInput){
	if (event.type == 'blur' || event.which == 13 || event.keyCode == 13) {
		if (dimension > -1) {
			var dimArray = dimensionArray[dimension][1];
			var multiplier = dimArray[row-1][column-1][2];
			var constant = dimArray[row-1][column-1][3];
			var unitID = dimensionArray[dimension][0]+row+column;
			var label1 = dimArray[row-1][column-1][0];
			var label2 = dimArray[row-1][column-1][1];
		}
		else {
			var multiplier = sheetArray[column-1][2];
			var constant = sheetArray[column-1][3];
			var unitID = 'sheet'+column; 
			var label1 = sheetArray[column-1][0];
			var label2 = sheetArray[column-1][1];
		}
		// get ids
		var inputID = "#"+unitID+" "+"#input"+posInput;
		var posOutput = posInput == 1 ? 2 : 1;
		var outputID = "#"+unitID+" "+"#input"+posOutput; 	
		// calculate output
		var input = $(inputID).val();
		if (input.length > 0) {
			var  output = posInput == 1 ? input*multiplier+constant: (input-constant)/multiplier;
			$(outputID).val(parseFloat(output.toFixed(3)));
		}
		else {
			$(outputID).val("");
		}
	}
	// Put conversion on the right when converted via 'enter'
	if (event.which == 13 || event.keyCode == 13) {
		if (input.length > 0){
			if (posInput == 1){
				var appendData = '<li>'+input+' '+label1+' = '+parseFloat(output.toFixed(3))+' '+label2+'</li>';
			}
			else {
				var appendData = '<li>'+input+' '+label2+' = '+output.toFixed(3)+' '+label1+'</li>';
			}
			$(appendData).appendTo('#recentList');
			$('#recentConversions').css('display','block');
		}
	}
	event.stopPropagation();
}