
 //---------------------------------------------------------------------------------
 //---------------------- U S E R    I N P U T -------------------------------------
 //---------------------------------------------------------------------------------
 
 
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

var theprompt = [
	{
        name: 'Press enter to start',
    },
    /*{
        name: 'username',
		//Regex för att vara på den säkra sidan
        validator: /^[0-9]{10}$/,
        //Om Regexen inte stämmer
        warning: 'Användarnamnet skall ha formatet ÅÅMMDDXXXX'
    },
    {
        name: 'password',
        hidden: true
    },*/
];

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

		await page.goto("https://www.willys.se/anvandare/inloggning", {
			waitUntil: 'networkidle0'
		});

		//Personnummer
		await page.waitForSelector("[name='loginSsn']");
		await page.click("[name='loginSsn']");
		await page.type("[name='loginSsn']", username);

		//password
		await page.keyboard.down("Tab");
		await page.keyboard.type(password);

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
		
		
		// - - - - - P A R S E    R E C E I P T S - - - - - -
		
		var receiptString = ""; 
		
		//Read text from receipt pdf
		await pdf(dataBuffer).then(function(data) {
			receiptString = data.text;
			console.log(data.text);
		});
		
		
		//Parse receipt to list of articles and their prices
		articles = parseArticles(receiptString);
		
		
		
		
		// - - - - - F I N D   A R T I C L E   C A T E G O R I E S  - - - - - -
		
		//Search for and add the articles respective categories and subcategories
		for (var i = 0; i < articles.length; i++){
	
			//Search for item number i
			await page.goto("https://www.willys.se/sok?q=" + encodeURIComponent(articles[i][0]), {
				waitUntil: 'networkidle2'
			});
			
            var gridSelector = "#main-content > div.flex-noshrink > div:nth-child(3) > div > ax-product-grid > div > div.ax-grid-container.ax-grid-row-medium.ax-product-grid-content.layout-row.layout-wrap.layout-align-start.start";
            			
            //#main-content > div.flex-noshrink > div:nth-child(3) > div > ax-product-grid > div > div.ax-grid-container.ax-grid-row-medium.ax-product-grid-content.layout-row.layout-wrap.layout-align-start.start > ax-product-puff:nth-child(2)

            //Den sista siffran i den här bös-strängen representerar vilken cell i gridden det är. Dvs (1) är längst upp till vänster

			//Wait for grid to load
			await page.waitForSelector(gridSelector);

            //Extract grid element
			const webArticles = await page.evaluate((gridSelector) => {
			   return document.querySelector(gridSelector).innerHTML;
			}, gridSelector);
               //Page.evaluate takes the funktion text and transfers it as LITERAL text into the chromium browser and executes it there, which is why it has to take gridSelector as an argument. Lot's of hours spent figuring that one out.			
            


            //Idag Tis 5:e November 2019 medans jag satt och skrev min kod gjorde Willys så att många
            //termer från kvittot inte längre går att använda för att söka på deras hemsida. 

            //Om man söker efter artikelnumret på deras sida, SOM MAN HITTAR PÅ DERAS SIDA, ger
            // den fortfarande inte rätt sökresultat på rätt plats. Herre min skapare. 

            //Att söka på artikelnumret för hushållsost ger blöjor som första sökträff
            console.log("//////////////////////////////////////////////");
            console.log("https://www.willys.se/sok?q=" + encodeURIComponent(articles[i][0]));
            console.log(articles[i][0]);
            console.log(webArticles);
            console.log("))))))))))))))))))))))))))))))))))))))))))))))");
			
		}	
			
		
		
		
		
		
		browser.close()
	})()
}




// -----------------------------------------------------------------------
// --------------- R E C E I P T   P A R S I N G -------------------------
// -----------------------------------------------------------------------


function sankeyGenString(){
	//Ska få olika levels av olika grejer
	//Oedning på stringsen spelar ingen roll, så länge nivåerna är rätt
}


//Takes an article and puppeteer-page, and return array of categories
function addCategories(articles, page){
	
	
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
