const puppeteer = require('puppeteer');

async function getdata() {
    return (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto("https://zh-hk.guitarians.com/landing/hk", {
                waitUntil: 'load'
            });
            const pageresult = await page.evaluate(() => {
                var tempresult = []


                for (var j = 0; j < document.getElementsByClassName("score-list-item3").length; j++) {
                    tempresult.push(document.getElementsByClassName("score-list-item3")[j].getElementsByClassName('score-name')[0].innerText)
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