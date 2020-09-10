const puppeteer = require('puppeteer');

async function getdata() {
    return (async () => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.goto("http://polygonguitar.blogspot.com/p/polygon.html", {
                waitUntil: 'load'
            });
            const pageresult = await page.evaluate(() => {
                var tempresult = []
                var tempul1 = document.getElementsByTagName('aside')[0].getElementsByTagName('ul')[0].getElementsByTagName('li')
                var tempul2 = document.getElementsByTagName('aside')[0].getElementsByTagName('ul')[1].getElementsByTagName('li')

                for (var j = 0; j < tempul2.length - 1; j++) {
                    tempresult.push(tempul2[j].innerText.split('. ')[1])
                }
                for (var j = 0; j < tempul1.length; j++) {
                    tempresult.push(tempul1[j].innerText.split(')')[1].split('[')[0])
                }
                console.log(tempresult)
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