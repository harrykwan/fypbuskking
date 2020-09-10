const puppeteer = require('puppeteer');

async function getdata() {
    return (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://open.spotify.com/playlist/37i9dQZF1DXdGUQjVlqY2Q", {
                waitUntil: 'load'
            });
            const pageresult = await page.evaluate(() => {
                var tempresult = []
                for (var j = 0; j < document.getElementsByClassName('tracklist-name').length; j++) {
                    tempresult.push(document.getElementsByClassName('tracklist-name')[j].innerHTML)
                }
                return {
                    text: tempresult
                };
            });

            // console.log(pageresult.text);
            await browser.close();
            // console.log(pageresult.text)
            return pageresult.text
        } catch (e) {
            console.log('server error ' + e)
        }
    })();
}
module.exports.getdata = getdata;