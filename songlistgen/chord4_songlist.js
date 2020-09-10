const puppeteer = require('puppeteer');

async function getdata() {
    return (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto("https://chord4.com/main/hot100", {
                waitUntil: 'load'
            });
            const pageresult = await page.evaluate(() => {
                var tempresult = []


                for (var j = 0; j < document.getElementById('search_result').getElementsByTagName('li').length; j++) {
                    tempresult.push(document.getElementById('search_result').getElementsByTagName('li')[j].innerText)
                }

                console.log(tempresult)
                return {
                    text: tempresult
                };
            });

            // console.log(pageresult.text);
            await browser.close();
            return pageresult.text
            // console.log(pageresult.text)
        } catch (e) {
            console.log('server error ' + e)
        }
    })();
}


module.exports.getdata = getdata;