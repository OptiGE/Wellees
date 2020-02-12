// PDF-parse
const fs = require('fs');
const pdf = require('pdf-parse');



console.log(parseAllArticles("examplereceipts"));


async function parseAllArticles(path){
		
	//Read how many pdf:s are in the receipts folder
	files = fs.readdirSync(path);
	//Save a list of those pdfs
	pdfs = files.filter(file => file.split(".")[1] == "pdf");
	console.log("Files found: " + pdfs);
	
	var allArticles = [];

	//Loop through pdfs
	for(var i = 0; i < pdfs.length; i++){
		
		//Read file
		let dataBuffer = fs.readFileSync(path + "/" + ("1") + ".pdf");
		
		//Parse file from pdf to text
		let data = await pdf(dataBuffer);
		
		//Add articles
		console.log(parseArticles(data.text));

	}
	
	return allArticles;
}
