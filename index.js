/* http://www.network-science.de/ascii/

# #    # # ##### 
# ##   # #   #   
# # #  # #   #   
# #  # # #   #   
# #   ## #   #   
# #    # #   # 

*/

let data = {}
data.MTheader = null;
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

function MTInitTable () {
	let monsters = data.monsters;
	let monstercount = Object.keys(monsters).length;
	for (let i = 0; i < monstercount; i++){
		let monsterName = data.monsters[Object.keys(data.monsters)[i]].monsterName;
		console.log(monsterName);
		MTAddRow(monsterName);
	}
}
function MTAddRow (monsterName){
	let newrow = document.createElement('tr');
	newrow.classList.add("monster");
	newrow.setAttribute('data-monster', monsterName);
	let children = [].slice.call(data.MTheader.children);
	children.forEach(function(child){
		let newcell = document.createElement('td');
		newcell.innerHTML = '-'
		newcell.setAttribute('data-field', child.getAttribute('data-field'));
		newcell.setAttribute('data-calc', child.getAttribute('data-calc'));
		newrow.append(newcell);
	});
	data.MTheader.parentElement.append(newrow);
	MTPopulateRow(monsterName);
}
function MTPopulateRow (monsterName) {
	// Get the target row
	let row = document.querySelector('[data-monster="' + monsterName + '"]');
	let monsterObject = data.monsters[monsterName];
	// iterate through cells and get values from monster
	let cells = Array.from(row.getElementsByTagName('td'));
	cells.forEach( function(cell, i) {
		// which value should we get?
		let field = cell.getAttribute('data-field');
		//console.log(field);
		// for some insane magical reason cell.getAttributes() returns 'null' as a string, not null.
		if (field !== 'null') {
			cell.innerHTML = monsterObject[field];
		}
		else {
			let type = cell.getAttribute('data-calc');
			//console.log(type)
			//value = type;
			switch (type){
				case 'defenses':
					cell.innerHTML = 'd';
					break;
				case 'qualities':
					cell.innerHTML = 'q';
					break;
				case 'actions':
					cell.innerHTML = 'a';
					break;
				case 'buttons':
					let editButton = document.createElement('button');
					editButton.innerHTML = 'E';
					cell.appendChild(editButton);
					let delButton = document.createElement('button');
					delButton.innerHTML = 'X';
					cell.appendChild(delButton);
					break;
			}
		}
	});
}
function MTDeleteMonster(monster){
	// Actually move them to data.trash
}
function MTGetColumns () {
	data.MTheader = document.querySelector("#MonsterTable table tr");
	//console.log(data.MTheader);
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
	console.log(mono);
	data.monsters[mono.monsterName] = mono;
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
		MTInitTable();
	}
}
function LoadFromLS () {

}
function SaveToLS () {

}

/* 

#    # ##### # #      # ##### # ######  ####  
#    #   #   # #      #   #   # #      #      
#    #   #   # #      #   #   # #####   ####  
#    #   #   # #      #   #   # #           # 
#    #   #   # #      #   #   # #      #    # 
 ####    #   # ###### #   #   # ######  ####

*/

function toArray(nodelist){
	return Array.from(nodelist);
}