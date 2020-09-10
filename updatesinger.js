const puppeteer = require('puppeteer');


(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://www.kkbox.com/hk/en/search.php?search=song&word=eason&sort=01", {
            waitUntil: 'load'
        });
        const pageresult = await page.evaluate(() => {
            var tempresult = []
            for (var j = 0; j < document.getElementsByClassName('search-group')[0].getElementsByClassName('song-data').length; j++) {
                tempresult.push(document.getElementsByClassName('search-group')[0].getElementsByClassName('song-data')[j].innerText.split('\n')[0])
            }

            return {
                text: tempresult,
                pagenum: parseInt(document.getElementsByClassName('pagination')[0].getElementsByTagName("li")[document.getElementsByClassName('pagination')[0].getElementsByTagName("li").length - 2].innerText)
            };
        });

        // console.log(pageresult.text);
        await browser.close();
        console.log(pageresult.text)
    } catch {
        console.log('server error')
    }
})();