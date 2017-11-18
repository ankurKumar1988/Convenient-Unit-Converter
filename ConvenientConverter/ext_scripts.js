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
		// add listunit
		appendData ='<div class="row">'+
					'<div class="col-sm-4"></div>'+
					'<div class="col-sm-4 unit">'+
						'<div class="cellInputLabel">'+
							'<input type="number" step="any" class="cellInput" id="selectinput1" onkeypress="convertUserSelect(event,'+k+',1)" onblur="convertUserSelect(event,'+k+',1)"><br>'+
							'<select class="form-control cellLabel" style="height:28px;padding:2px;" id="selectLabel1"></select>'+
						'</div>'+
						'<div class="cellEqual">=<br>&nbsp</div>'+
						'<div class="cellInputLabel">'+
							'<input type="number" step="any" class="cellInput" id="selectinput2" onkeypress="convertUserSelect(event,'+k+',2)" onblur="convertUserSelect(event,'+k+',2)"><br>'+
							'<select class="form-control cellLabel" style="height:28px;;padding:2px;" id="selectLabel2"></select>'+
						'</div>'+
						'<button  type="button" class="btn btn-warning uploadButton" onclick="uploadToSheetUserSelect('+k+')">'+
							'<span class="glyphicon glyphicon-arrow-up"></span>'+
						'</button>'+
					'</div>'+
					'<div class="col-sm-4"></div>'+
					'</div>';
		$(appendData).appendTo('#'+dimName+' #userSelect');		
		$('<hr style="margin-top: 7px; border-color: #333;">').appendTo('#'+dimName+' #userSelect');
		generateUserSelectList(k);
		// add default boxes
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
						'<button  type="button" class="btn btn-danger cancelButton" onclick="deleteFromSheet('+(nlist_items+1)+')">'+
							'<span class="glyphicon glyphicon-remove"></span>'+
						'</button>'+
					'</div>'+
				'</li>'
	
	$(appendData).appendTo('#sortable');
	$("#sheet"+(nlist_items+1)+" #input1").val(val1);
	$("#sheet"+(nlist_items+1)+" #input2").val(val2);
}

function uploadToSheetUserSelect(dimension){
	dimName = dimensionArray[dimension][0];
	dimArray = dimensionArray[dimension][1];
	var selectLabel1 = $('#'+dimName+' #selectLabel1').val();
	var selectLabel2 = $('#'+dimName+' #selectLabel2').val();
	// check if both units have been selected
	if (selectLabel1 == null || selectLabel2 == null){alert('Please select both units');return;}
	// check if equal labels
	if (selectLabel1 == selectLabel2){alert('Please select different units');return;}
	// find number of li items
	var list_items = $('#sortable').children();
	nlist_items = list_items.length;
	// append new list item
	var val1 = $('#'+dimName+' #selectinput1').val();
	var val2 = $('#'+dimName+' #selectinput2').val();
	var appendData = '<li id="sheet'+(nlist_items+1)+'">'+ 
					'<div class="unit" style="display:inline-block;">'+
						'<div class="cellInputLabel">'+
							'<input type="number" step = "any" class="cellInput" id="input1" onkeypress="convert(event,-1,1,'+(nlist_items+1)+',1)" onblur="convert(event,-1,1,'+(nlist_items+1)+',1)"><br>'+
							'<label style="display:inline-block;" class="cellLabel">'+selectLabel1+'</label>'+
						'</div>'+
						'<div class="cellEqual">=<br> &nbsp </div>'+
						'<div class="cellInputLabel">'+
							'<input type="number" step="any" class="cellInput" id="input2" onkeypress="convert(event,-1,1,'+(nlist_items+1)+',2)" onblur="convert(event,-1,1,'+(nlist_items+1)+',2)"><br>'+
							'<label style="display:inline-block;" class="cellLabel">'+selectLabel2+'</label>'+
						'</div>'+
						'<button  type="button" class="btn btn-danger cancelButton" onclick="deleteFromSheet('+(nlist_items+1)+')">'+
							'<span class="glyphicon glyphicon-remove"></span>'+
						'</button>'+
					'</div>'+
				'</li>'
	
	// generate the conversion array
	var multiplier;
	var constant;
	var found = 0;
	
	// check if the two labels are already there together
	for (i=0; i < dimArray.length; i++){
		for (j=0; j < dimArray[i].length; j++){
			if (dimArray[i][j][0]==selectLabel1){
				if (dimArray[i][j][1]==selectLabel2){multiplier=dimArray[i][j][2];constant=dimArray[i][j][3];sheetArray.push([selectLabel1,selectLabel2,multiplier,constant]);found=1;}
			}
			if (dimArray[i][j][1]==selectLabel1){
				if (dimArray[i][j][0]==selectLabel2){multiplier=1/dimArray[i][j][2];constant=-dimArray[i][j][3]/dimArray[i][j][2];sheetArray.push([selectLabel1,selectLabel2,multiplier,constant]);found=1;}
			}
			if (dimArray[i][j][0]==selectLabel2){
				if (dimArray[i][j][1]==selectLabel1){multiplier=1/dimArray[i][j][2];constant=-dimArray[i][j][3]/dimArray[i][j][2];sheetArray.push([selectLabel1,selectLabel2,multiplier,constant]);found=1;}
			}
			if (dimArray[i][j][1]==selectLabel2){
				if (dimArray[i][j][0]==selectLabel1){multiplier=dimArray[i][j][2];constant=dimArray[i][j][3];sheetArray.push([selectLabel1,selectLabel2,multiplier,constant]);found=1;}
			}
		}
	}
	
	// find labels via depth-first search
	if (found == 0){
		labelVisited = [];
		var outputVal = treeSearchforSheetUpload(selectLabel1,1,2,selectLabel2);
		if (outputVal.length >= 1){
			var outputVal1 = outputVal[0];
			var outputVal2 = outputVal[1];
			multiplier = outputVal2-outputVal1;
			constant = 2*outputVal1-outputVal2;
			sheetArray.push([selectLabel1,selectLabel2,multiplier,constant]);
			found = 1;
		}
		else{
			alert('Chosen unit conversion relationship not available. Upload failed.');
		}
	}
	
	// check if new box need to be added
	if (found == 1){
		$(appendData).appendTo('#sortable');
		$("#sheet"+(nlist_items+1)+" #input1").val(val1);
		$("#sheet"+(nlist_items+1)+" #input2").val(val2);
	}
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
							'<button  type="button" class="btn btn-warning uploadButton" onclick="uploadToSheet('+dimension+','+row+','+col+')">'+
								'<span class="glyphicon glyphicon-arrow-up"></span>'+
							'</button>'+
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
		// update userSelect list
		generateUserSelectList(dimension);
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

function convertUserSelect(event,dimension,posInput){
	if (event.type == 'blur' || event.which == 13 || event.keyCode == 13) {
		dimName = dimensionArray[dimension][0];
		dimArray = dimensionArray[dimension][1];
		// get ids
		var inputID = "#"+dimName+" "+"#selectinput"+posInput;
		var inputlabel = $("#"+dimName+" "+"#selectLabel"+posInput).val();
		if ($(inputID).val().length < 1){event.stopPropagation();return;}
		var posOutput = posInput == 1 ? 2 : 1;
		var outputID = "#"+dimName+" "+"#selectinput"+posOutput;
		var outputlabel = $("#"+dimName+" "+"#selectLabel"+posOutput).val();
		
		// check if equal labels
		var selectLabel1 = $('#'+dimName+' #selectLabel1').val();
		var selectLabel2 = $('#'+dimName+' #selectLabel2').val();
		if (selectLabel1 == selectLabel2){$(outputID).val($(inputID).val());event.stopPropagation();return;}
		// check if both units have been selected
		if (selectLabel1 == null || selectLabel2 == null){event.stopPropagation();return;}
		
		// check if the two labels are already there together
		for (i=0; i < dimArray.length; i++){
			for (j=0; j < dimArray[i].length; j++){
				if (dimArray[i][j][0]==selectLabel1){
					if (dimArray[i][j][1]==selectLabel2){userSelectOutput(inputID,outputID,'direct',posInput,dimArray[i][j],event,inputlabel,outputlabel);event.stopPropagation();return;}
				}
				if (dimArray[i][j][1]==selectLabel1){
					if (dimArray[i][j][0]==selectLabel2){userSelectOutput(inputID,outputID,'reverse',posInput,dimArray[i][j],event,inputlabel,outputlabel);event.stopPropagation();return;}
				}
				if (dimArray[i][j][0]==selectLabel2){
					if (dimArray[i][j][1]==selectLabel1){userSelectOutput(inputID,outputID,'reverse',posInput,dimArray[i][j],event,inputlabel,outputlabel);event.stopPropagation();return;}
				}
				if (dimArray[i][j][1]==selectLabel2){
					if (dimArray[i][j][0]==selectLabel1){userSelectOutput(inputID,outputID,'direct',posInput,dimArray[i][j],event,inputlabel,outputlabel);event.stopPropagation();return;}
				}
			}
		}
		
		// find labels via depth-first search
		labelVisited = [];
		var outputVal = treeSearch(inputlabel,$(inputID).val(),outputlabel);
		if (outputVal != ''){
			$(outputID).val(parseFloat(outputVal.toFixed(3)));
			// Put conversion on the right when converted via 'enter'
			if (event.which == 13 || event.keyCode == 13) {
				var appendData = '<li>'+$(inputID).val()+' '+inputlabel+' = '+parseFloat(outputVal.toFixed(3))+' '+outputlabel+'</li>';
				$(appendData).appendTo('#recentList');
				$('#recentConversions').css('display','block');
			}	
		}
	}
	event.stopPropagation();
}

function treeSearchforSheetUpload(inputlabel,inputVal1,inputVal2,outputlabel){
	var returnedOutput; var returnedOutput1; var returnedOutput2;
	labelVisited.push(inputlabel);
	for (var i=0; i < dimArray.length; i++){
		for (var j=0; j < dimArray[i].length; j++){
			if (dimArray[i][j][0]==inputlabel){
				if (dimArray[i][j][1]==outputlabel){
					returnedOutput1 = inputVal1*dimArray[i][j][2]+dimArray[i][j][3];
					returnedOutput2 = inputVal2*dimArray[i][j][2]+dimArray[i][j][3];
					return [returnedOutput1,returnedOutput2];
				}
				else{
					if (labelVisited.indexOf(dimArray[i][j][1])>-1){
						continue;
					}
					var newinputVal1 = inputVal1*dimArray[i][j][2]+dimArray[i][j][3];
					var newinputVal2 = inputVal2*dimArray[i][j][2]+dimArray[i][j][3];
					returnedOutput = treeSearchforSheetUpload(dimArray[i][j][1],newinputVal1,newinputVal2,outputlabel);
					if (returnedOutput.length >= 1){
						return returnedOutput;
					}
				}
				continue;
			}
			if (dimArray[i][j][1]==inputlabel){
				if (dimArray[i][j][0]==outputlabel){
					returnedOutput1 = (inputVal1-dimArray[i][j][3])/dimArray[i][j][2];
					returnedOutput2 = (inputVal2-dimArray[i][j][3])/dimArray[i][j][2];
					return [returnedOutput1,returnedOutput2];
				}
				else{
					if (labelVisited.indexOf(dimArray[i][j][0])>-1){
						continue;
					}
					var newinputVal1 = (inputVal1-dimArray[i][j][3])/dimArray[i][j][2];
					var newinputVal2 = (inputVal2-dimArray[i][j][3])/dimArray[i][j][2];
					returnedOutput = treeSearchforSheetUpload(dimArray[i][j][0],newinputVal1,newinputVal2,outputlabel);
					if (returnedOutput.length >= 1){
						return returnedOutput;
					}
				}
			}
		}
	}
	returnedOutput =[];
	return returnedOutput;
}

function treeSearch(inputlabel,inputVal,outputlabel){
	var returnedOutput;
	labelVisited.push(inputlabel);
	for (var i=0; i < dimArray.length; i++){
		for (var j=0; j < dimArray[i].length; j++){
			if (dimArray[i][j][0]==inputlabel){
				if (dimArray[i][j][1]==outputlabel){
					returnedOutput = inputVal*dimArray[i][j][2]+dimArray[i][j][3];
					return returnedOutput;
				}
				else{
					if (labelVisited.indexOf(dimArray[i][j][1])>-1){
						continue;
					}
					var newinputVal = inputVal*dimArray[i][j][2]+dimArray[i][j][3];
					returnedOutput = treeSearch(dimArray[i][j][1],newinputVal,outputlabel);
					if (returnedOutput != ''){
						return returnedOutput;
					}
				}
				continue;
			}
			if (dimArray[i][j][1]==inputlabel){
				if (dimArray[i][j][0]==outputlabel){
					returnedOutput = (inputVal-dimArray[i][j][3])/dimArray[i][j][2];
					return returnedOutput;
				}
				else{
					if (labelVisited.indexOf(dimArray[i][j][0])>-1){
						continue;
					}
					var newinputVal = (inputVal-dimArray[i][j][3])/dimArray[i][j][2];
					returnedOutput = treeSearch(dimArray[i][j][0],newinputVal,outputlabel);
					if (returnedOutput != ''){
						return returnedOutput;
					}
				}
			}
		}
	}
	returnedOutput ='';
	return returnedOutput;
}

function userSelectOutput(inputID,outputID,direction,posInput,unitArray,event,inputlabel,outputlabel){
	var input = $(inputID).val();
	var multiplier = unitArray[2];
	var constant = unitArray[3];
	if (direction == 'direct'){
		var  output = posInput == 1 ? input*multiplier+constant: (input-constant)/multiplier;
	}
	else {
		var  output = posInput == 2 ? input*multiplier+constant: (input-constant)/multiplier;
	}
	$(outputID).val(parseFloat(output.toFixed(3)));
	// Put conversion on the right when converted via 'enter'
	if (event.which == 13 || event.keyCode == 13) {
		var appendData = '<li>'+input+' '+inputlabel+' = '+parseFloat(output.toFixed(3))+' '+outputlabel+'</li>';
		$(appendData).appendTo('#recentList');
		$('#recentConversions').css('display','block');
	}
}

function generateUserSelectList(k){
	var uniqueUnits = [];
	dimName = dimensionArray[k][0];
	dimArray = dimensionArray[k][1];
	// empty current list
	$('#'+dimName+' #selectLabel1').empty();
	$('#'+dimName+' #selectLabel2').empty();
	// find all unique units
	for (i=0; i < dimArray.length; i++){
		for (j=0; j < dimArray[i].length; j++){
			if (uniqueUnits.indexOf(dimArray[i][j][0])==-1){
				uniqueUnits.push(dimArray[i][j][0]);
			}
			if (uniqueUnits.indexOf(dimArray[i][j][1])==-1){
				uniqueUnits.push(dimArray[i][j][1]);
			}
		}
	}
	// put all unique units in selectable label
	$('<option disabled selected>Choose unit</option>').appendTo('#'+dimName+' #selectLabel1');
	$('<option disabled selected>Choose unit</option>').appendTo('#'+dimName+' #selectLabel2');
	for (l=0; l < uniqueUnits.length; l++){
		$('<option>'+uniqueUnits[l]+'</option>').appendTo('#'+dimName+' #selectLabel1');
		$('<option>'+uniqueUnits[l]+'</option>').appendTo('#'+dimName+' #selectLabel2');
	}
}