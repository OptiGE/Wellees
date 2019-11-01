
 // `INSTAGRAM_USER=myuser INSTAGRAM_PWD=mypassword node instagram.js`
 //https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e
 
 
 //---------------------------------------------------------------------------------
 //---------------------- U S E R    I N P U T -------------------------------------
 //---------------------------------------------------------------------------------
 
 
 // Importera prompt. Smidigt sätt att ta user input
var prompt = require('prompt');

var username = "";
var password = "";

var theprompt = [
    {
        name: 'username',
		//Regex för att vara på den säkra sidan
        validator: /^[0-9]{10}$/,
        //Om Regexen inte stämmer
        warning: 'Användarnamnet skall ha formatet ÅÅMMDDXXXX'
    },
    {
        name: 'password',
        hidden: true
    },
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
	const puppeteer = require('puppeteer')
	const screenshot = 'instagram.png';

	(async () => {
		const browser = await puppeteer.launch({
			headless: false
		})
		
		
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
		
		
		/*
		//Såhär hittar man login knappen om man är riktigt smart
		await page.evaluate(() => {
			let btns = [...document.querySelector(".HmktE").querySelectorAll("button")];
			btns.forEach(function (btn) {
				if (btn.innerText == "Logga in")
					btn.click();
			});
		});
		*/

		await page.goto("https://www.willys.se/mitt-konto/ordrar", {
			waitUntil: 'networkidle0'
		});
		
		

		browser.close()
	})()
}