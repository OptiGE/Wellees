const fs = require('fs');
const pdf = require('pdf-parse');
 
 
let dataBuffer = fs.readFileSync('examplereceipts/1.pdf');
 
pdf(dataBuffer).then(function(data) {
    // PDF text
    //console.log(data.text);
    console.log(shittysankeyGenString(parseArticles(data.text)));
});


function shittysankeyGenString(articlePricePairs){
	var sankeyString = "";
	
	var i;
	for (var i = 0; i < articlePricePairs.length; i++){
		sankeyString += "Budget [" + articlePricePairs[i][1] + "] " + articlePricePairs[i][0] + "\n";
	}
	
	return sankeyString;
}


function sankeyGenString(){
	//Ska få olika levels av olika grejer
	//Oedning på stringsen spelar ingen roll, så länge nivåerna är rätt
}


//receiptString contains full receipt 
//Returns array of pairs of items and their respective prices
function parseArticles(receiptString){
	
	
	//TODO
	//Parse Rabatter
	//Parse Extrapris (3.pdf)
	//Parse Kilopriser
	
	
	var articlePricePairs = [];
	
	receiptLines = receiptString.split("\n");
	
	//Iterate through each line, starting with the dashed line
	var start = receiptLines.indexOf("------------------------------------------") + 1;
	for (var i = start; i < receiptLines.length; i++){
		
		//Guards
		if (receiptLines[i].charAt(0) == " ") {continue;} //If sale info line
		if (receiptLines[i] == "------------------------------------------") {break;} //If ending line
		
		words = receiptLines[i].split(" ");
		
		var pair = ["", ""];
		//Pick out all words from left to right
		while (words[0] != ""){
			pair[0] += words.shift() + " ";
		}
		//Remove the last blankspace
		pair[0] = pair[0].slice(0, -1);
		
		//Add the price (furthest to the right on each line)
		pair[1] = words.pop();
		
		//Push pair to the main array
		articlePricePairs.push(pair)
	}
	
	return articlePricePairs;
	
}