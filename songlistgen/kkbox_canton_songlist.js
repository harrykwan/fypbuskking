const puppeteer = require('puppeteer');

async function getdata() {
    return (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://kma.kkbox.com/charts/daily/song?terr=tw&lang=tc&cate=320", {
                waitUntil: 'load'
            });
            const pageresult = await page.evaluate(() => {
                var tempresult = []
                for (var j = 0; j < document.getElementsByClassName('charts-list-song').length; j++) {
                    if (document.getElementsByClassName('charts-list-song')[j].innerText != '')
                        tempresult.push(document.getElementsByClassName('charts-list-song')[j].innerText)
                }
                return {
                    text: tempresult
                };
            });

            // console.log(pageresult.text);
            await browser.close();
            return pageresult.text
            console.log(pageresult.text)
        } catch (e) {
            console.log('server error ' + e)
        }
    })();
}

module.exports.getdata = getdata;