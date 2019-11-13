
//TODO, actually utilize the async!!
//TODO, Implement using google Sankey because it's a lot prettier!
 
 
 
 //--------------------------------------------------------------------------------------------------------
 //---------------------- V A R I A B L E    D E C L A R A T I O N S  -------------------------------------
 //--------------------------------------------------------------------------------------------------------
 
 
 // Importera prompt. Smidigt sätt att ta user input
var prompt = require('prompt');

var username = "";
var password = "";

// PDF-parse
const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('examplereceipts/1.pdf');

//Puppeteer
const puppeteer = require('puppeteer')
const screenshot = 'instagram.png';

var theprompt = 
[
	{name: 'Press enter to start'},
    {name: 'username', validator: /^[0-9]{10}$/, warning: 'Användarnamnet skall ha formatet ÅÅMMDDXXXX'},
    {name: 'password', hidden: true},
];





 //---------------------------------------------------------------------------------
 //---------------------- U S E R    I N P U T -------------------------------------
 //---------------------------------------------------------------------------------

/*

// Starta prompten för att ta användarinput
prompt.start();

prompt.get(theprompt, function (err, result) {
    if (err) { //funkar eftersom err är tom om allt går bra
        console.log(err);
        return 1;
    }else {
        // Display user input in console log.
        console.log("Loggar in på Willys.se med " + result.username + " som personnummer");
		wellees(result.username, result.password);
    }
});
*/


wellees("name", "password"); //Ta bort denna när prompten läggs in igen
 
 
 
 //-------------------------------------------------------------------------------------
 //----------------------------------- H E A D L E S S ---------------------------------
 //-------------------------------------------------------------------------------------
 
 
function wellees(username, password){

	(async () => {
		const browser = await puppeteer.launch({
			headless: true,    
            args: ['--no-sandbox'] //linux-chromium fix
		});

		
		
		// - - - - L O G I N - - - - - -
		
		const page = await browser.newPage()
		await page.setViewport({width:1280, height:2200});

/*
		await page.goto("https://www.willys.se/anvandare/inloggning", {
			waitUntil: 'networkidle0'
		});

		//Personnummer
		await page.waitForSelector("[name='loginSsn']");
		await page.click("[name='loginSsn']");
		await page.type("[name='loginSsn']", "username");

		//password
		await page.keyboard.down("Tab");
		await page.keyboard.type("password");

		//loginknappen
		await page.keyboard.down("Tab"); //Det ligger en låda emellan
		await page.keyboard.down("Tab");
		await page.keyboard.down("Enter");



		// - - - - N A V I G A T E   T O    R E C E I P T S  - - - - - -
	
		await page.goto("https://www.willys.se/mitt-konto/ordrar", {
			waitUntil: 'networkidle0'
		});
		
		//TODO
		// ACTUALLY NAVIGATE TO RECEIPTS
		// DOWNLOAD RECEIPT AND READ IT INTO STRING TO BE SENT TO parseArticles
		// let dataBuffer = fs.readFileSync('examplereceipts/1.pdf');
		*/
		
		
		// - - - - - - D O W N L O A D    R E C E I P T S - - - - - - - 
		
		//Download them into a folder named 1.pdf - n.pdf 
		
		
		// - - - - - P A R S E    R E C E I P T S - - - - - -
		
		//Parse receipt to list of articles and their prices
		var articles = await parseAllArticles("examplereceipts"); //Articles have structure: [[Article, Price], ...] where article and price are strings
		
		
		
		
		
		// - - - - - F I N D   A R T I C L E   C A T E G O R I E S  - - - - - -
		
		//Search for and add the articles respective categories and subcategories
		for (var i = 0; i < articles.length; i++){
				console.log("New element");
				console.log("");
				//Search for item number i
				await page.goto("https://www.willys.se/sok?q=" + encodeURIComponent(articles[i][0]), {
					waitUntil: 'networkidle2'
				});						   
			   
				//Extract grid of articles
				var gridSelector = "#main-content > div.flex-noshrink > div:nth-child(3) > div > ax-product-grid > div > div.ax-grid-container.ax-grid-row-medium.ax-product-grid-content.layout-row.layout-wrap.layout-align-start.start";	

				await page.waitForSelector(gridSelector);
				const grid = await page.evaluate((gridSelector) => {
				   return document.querySelector(gridSelector).innerHTML;
				}, gridSelector);  

				//Skip if search yielded no results, and add "uncertain" as category of object
				if(grid == "<!----><!---->"){
					articles[i].push(["Osäker kategori"]);
					continue;
				}

				//Click the first article in grid (should be iterable in future)
				var firstArticle = "#main-content > div.flex-noshrink > div:nth-child(3) > div > ax-product-grid > div > div.ax-grid-container.ax-grid-row-medium.ax-product-grid-content.layout-row.layout-wrap.layout-align-start.start > ax-product-puff:nth-child(1) > div > div.ax-product-puff-head > div";
				await page.click(firstArticle);

				//Wait for product page to load and extract categories
				await page.waitForSelector("#selenium--product-detail-dialog > md-dialog-content > div.md-dialog-content > p > small:nth-child(2) > a > span"); //Wait for categories to load (all categories have at least 2 levels)
				const categories = await page.evaluate(() => {
					let categoryArray = [];
					let links = document.querySelectorAll("#selenium--product-detail-dialog > md-toolbar > div > div > small > a"); //Each subcategory is a separate link
					console.log("Hejhej");
					links.forEach(link => {
						categoryArray.push(link.firstChild.innerText);
					})
					return categoryArray;
				});
				
				console.log(categories);
				
				//Push category array into main array of the respective articles
				articles[i].push(categories);
			
		}	
		
		//Article categories found, now do stuff with them
		articles.forEach((element) => console.log(element));
		
		sankeyString = sankeyGenString(articles);
		console.log(sankeyString);
		
		
		browser.close()
	})()
}




// -----------------------------------------------------------------------
// --------------- R E C E I P T   P A R S I N G -------------------------
// -----------------------------------------------------------------------

function parseAllArticles(path){
		
	//Read how many pdf:s are in the receipts folder
	files = fs.readdirSync(path);
	pdfs = files.filter(file => file.split(".")[1] == "pdf");
	
	console.log("Files found: " + pdfs);
	
	var allArticles = [];
	
	
	
	
	
	
	
	
	//FORTSÄTT NEDAN! DET DAMPAR FÖR ATT DET ÄR ASYNC!
	//"UTE UR LOOPEN" PRINTAS INNAN ALLT DET SOM ÄR INNE I LOOPEN
	
	
	
	
	
	
	
	
	
	for(var i = 0; i < pdfs.length; i++){
		pdf(fs.readFileSync(path + "/" + (i+1) + ".pdf")).then(function(data) {
			console.log(parseArticles(data.text));
			console.log("");
		});
	}
	
	console.log("Ute ur loopen");
	
	return allArticles;
}

//Input: Full receipt as string. Output: Array of pairs of items and their respective prices
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



// --------------------------------------------------------------------------
// --------------- G R A P H    G E N E R A T I N G -------------------------
// --------------------------------------------------------------------------


//Input: entry, value, exit. Output: Inputs parsed for sankeymatic.com
function sankeyLine(entry, value, exit){
	return entry + " [" + value.replace(",", ".") + "] " + exit + "\n";  
}

//Input: array of article, price and subcategories. Output: string to paste at sankeymatic.com
function sankeyGenString(articles){
	var returnString = "";
	articles.forEach(function (article){
		returnString += sankeyLine("Totalt", article[1], article[2][0]);
		for (var i = 0; i < article[2].length - 1; i ++){
			returnString += sankeyLine(article[2][i], article[1], article[2][i + 1]);
		}
		returnString += sankeyLine(article[2].slice(-1)[0], article[1], article[0]); 
	});
	
	return returnString;
}
