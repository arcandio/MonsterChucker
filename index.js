/* http://www.network-science.de/ascii/

# #    # # ##### 
# ##   # #   #   
# # #  # #   #   
# #  # # #   #   
# #   ## #   #   
# #    # #   # 

*/

let data = {}
let MTheader = null;
let inputTypes = [
	'input[type="checkbox"]',
	'input[type="radio"]',
	'input[type="text"]',
	'textarea',
	'input[type="number"]',
	'select',
]


document.addEventListener("DOMContentLoaded", function() {
	// load data
	LoadDefaultMonsters();
	LoadFromLS();
	// setup page
	SetupNav();
	MTGetColumns();
	SetupFields();
});

/*

#     #               
##    #   ##   #    # 
# #   #  #  #  #    # 
#  #  # #    # #    # 
#   # # ###### #    # 
#    ## #    #  #  #  
#     # #    #   ##   
                      
*/
function SetupNav (){
	var navelement = document.getElementsByTagName("nav")[0];
	//console.log(navelement.children);
	for (let i = 0; i < navelement.children.length; i++){
		var button = navelement.children[i];
		button.addEventListener("change", SwitchPage);
	}
}
function SwitchPage(e){
	// hide all pages
	let pages = document.querySelectorAll(".page");
	//console.log(pages);
	for (var i = pages.length - 1; i >= 0; i--) {
		pages[i].classList.remove("activePage");
	}
	// show the right page
	let target = e.srcElement.getAttribute('value');
	//console.log(target);
	let page = document.getElementById(target);
	page.classList.add("activePage");
}

/*

#     #                                          
##   ##  ####  #    #  ####  ##### ###### #####  
# # # # #    # ##   # #        #   #      #    # 
#  #  # #    # # #  #  ####    #   #####  #    # 
#     # #    # #  # #      #   #   #      #####  
#     # #    # #   ## #    #   #   #      #   #  
#     #  ####  #    #  ####    #   ###### #    # 
                                                 
#######                             
   #      ##   #####  #      ###### 
   #     #  #  #    # #      #      
   #    #    # #####  #      #####  
   #    ###### #    # #      #      
   #    #    # #    # #      #      
   #    #    # #####  ###### ###### 

*/
function MTPopulateRows () {
	// remove all rows first
	let rows = document.querySelectorAll('[data-monster]');
	console.log(rows);
	for (let i = 0; i < rows.length; i++){
		rows[i].remove();
	}
	// add new rows
	for (let key in data.monsters) {
		let mon = data.monsters[key];
		//console.log(mon);
		MTAddRow(mon);
	}
}
function MTAddRow (monster){
	if(!monster){
		return;
	}
	let newrow = document.createElement('tr');
	newrow.classList.add("monster");
	newrow.setAttribute('data-monster', monster);
	let children = [].slice.call(MTheader.children);
	children.forEach(function(child){
		let newcell = document.createElement('td');
		newcell.innerHTML = '-'
		newcell.innerHTML = MTFillCell(MTGetCellParams(child), monster);
		newrow.append(newcell);
	});
	if (monster) {
		// apply monster stats
	}
	MTheader.parentElement.append(newrow);
}
function MTGetCellParams (headercell) {
	let params = {}
	params.inputType = headercell.getAttribute('data-coltype');
	params.inputName = headercell.innerHTML;
	return params;
}
function MTFillCell (params, monster) {
	let elem = '';
	let key = params.inputName.toLowerCase();
	elem = monster[key];
	return elem;
}
function MTGetColumns () {
	MTheader = document.querySelector("#MonsterTable table tr");
	//console.log(MTheader);
}

/*

#    #  ####  #    #  ####  ##### ###### #####  
##  ## #    # ##   # #        #   #      #    # 
# ## # #    # # #  #  ####    #   #####  #    # 
#    # #    # #  # #      #   #   #      #####  
#    # #    # #   ## #    #   #   #      #   #  
#    #  ####  #    #  ####    #   ###### #    # 
                                                
                                    
###### #####  # #####  ####  #####  
#      #    # #   #   #    # #    # 
#####  #    # #   #   #    # #    # 
#      #    # #   #   #    # #####  
#      #    # #   #   #    # #   #  
###### #####  #   #    ####  #    # 

*/


function SaveMonster () {
	let mono = CreateMonsterObject();
	data.monsters[mono[monsterName]] = mono;
	MTPopulateRows();
}
function CreateMonsterObject(){
	let mono = {};
	let editorDiv = document.getElementById('MonsterEditor');
	// Do each type of input, 1 at a time
	inputTypes.forEach(function(type){
		SerializeInputs(type, editorDiv, mono)
	});
	//console.log(labels);
	console.log(JSON.stringify(mono, null, 2));
	return mono;
}
function SerializeInputs(queryString, editorDiv, mono){
	let elements = editorDiv.querySelectorAll(queryString);
	for (let i = elements.length - 1; i >= 0; i--) {
		let element = elements[i];
		let value = element.value;
		let key = element.id;
		// The only input type that we use that doesn't use `.value`
		// is checkbox, so we catch that specifically
		if (queryString.includes('checkbox') || queryString.includes('radio')){
			value = element.checked;
		}
		if (element.hasAttribute('disabled') || !key || !value){
			continue;
		}
		mono[key] = value;
	}
}
function UpdateCalculatedFields (){
	// In this function, we recalculate ALL calculated fields, all at once
	let fields = document.querySelectorAll('#MonsterEditor [id][disabled]')
	console.log(fields);
}
function SetupFields() {
	// get a list of all updatable fields
	let editorDiv = document.getElementById('MonsterEditor');
	let fields = [];
	inputTypes.forEach(function(type){
		//console.log(editorDiv.querySelectorAll(type));
		fields = fields.concat(Array.prototype.slice.call(editorDiv.querySelectorAll(type)));
	});
	//console.log(fields);
	fields.forEach(function(field){
		// add event listener to each
		if (!field.hasAttribute('disabled')){
			field.addEventListener('change', UpdateCalculatedFields);
		}
	});
}

/*

#####    ##   #####   ##   
#    #  #  #    #    #  #  
#    # #    #   #   #    # 
#    # ######   #   ###### 
#    # #    #   #   #    # 
#####  #    #   #   #    # 

*/
function LoadDefaultMonsters() {
	let dataUrl = './monsters.json'
	let request = new XMLHttpRequest();
	request.open('GET', dataUrl);
	request.responseType = 'json';
	request.send();
	request.onload = function () {
		data.monsters = request.response;
		//console.log(data.monsters);
		MTPopulateRows();
	}
}
function LoadFromLS () {

}
function SaveToLS () {

}