var express = require("express");
var googleIt = require('google-it');
const puppeteer = require('puppeteer');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var app = express();
const fs = require('fs');
const updatesonglist = require('./updatesonglist.js')
const path = require('path');


updatesonglist.start()
// updatesonglist.getall()

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use('/public', express.static('public'))
// app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/googleit/:query', function (req, res) {
  console.log(req.params.query)
  log.info('google ', req.params.query);


  googleIt({
    'query': req.params.query + ' chord',
    limit: 15
  }).then(results => {
    // access to results object here
    // getpage(results[0].link,res)
    // getwebsite('https://zh-hk.guitarians.com/chord/86565/88VARGINA--%E8%AA%AA%E4%BA%86%E5%86%8D%E8%A6%8B',res)
    res.send(results)
    //   res.send('ok')
  }).catch(e => {
    // any possible errors that might have occurred (like no Internet connection)
  })
});


app.get('/getchordpage/:query', function (req, res) {
  console.log(req.params.query)
  if (req.params.query) {
    var templink = req.params.query
    templink = templink.split("|").join('/');
    log.info('getchord ', templink);
    getpage(templink, function (x) {
      //   console.log(x)
      res.send(x)
    })
    // res.send(getpage(templink))
  } else
    res.send('no query')
});

app.get('/getsingersonglist/:singer/:pagenum?', function (req, res) {
  console.log(req.params.singer)
  if (req.params.singer) {
    var singer = req.params.singer
    var pagenum = req.params.pagenum
    if (!pagenum) {
      pagenum = 1
    }
    getsingersonglist(singer, function (result, pagenum) {
      res.send({
        result: result,
        maxpage: pagenum
      })
    }, pagenum)
  } else
    res.send('no query')
});


app.get('/getsingername/:singer/:pagenum?', function (req, res) {
  console.log(req.params.singer)
  if (req.params.singer) {
    var singer = req.params.singer
    var pagenum = req.params.pagenum
    if (!pagenum) {
      pagenum = 1
    }
    getsingername(singer, function (result, pagenum) {
      res.send({
        result: result,
        maxpage: pagenum
      })
    }, pagenum)
  } else
    res.send('no query')
});


app.get('/getallsonglist', function (req, res) {
  fs.readFile('songlist.json', (err, data) => {
    if (err) throw err;
    let songlist = JSON.parse(data);
    // console.log(student);
    res.send(songlist)
  });
});

app.get('/getchorddata/:chord', function (req, res) {
  if (req.params.chord) {
    var chordname = req.params.chord
    fs.readFile('./allchord/' + chordname + '.JSON', (err, data) => {
      if (err) {
        res.send('read file error')
        throw err;
      }
      // console.log(JSON.parse(data));
      res.send(data)
    });
  } else
    res.send('no query')


})







function getsingername(singer, callback, pagenum) {
  return (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto("https://www.kkbox.com/hk/en/search.php?search=artist&word=" + singer + "&sort=01&cur_page=" + pagenum, {
        waitUntil: 'load'
      });

      const pageresult = await page.evaluate(() => {

        var tempresult = []
        for (var j = 0; j < document.getElementsByClassName('search-group')[0].getElementsByTagName('a').length; j++) {
          tempresult.push(document.getElementsByClassName('search-group')[0].getElementsByTagName('a')[j].title)
        }

        return {
          text: tempresult,
          pagenum: parseInt(document.getElementsByClassName('pagination')[0].getElementsByTagName("li")[document.getElementsByClassName('pagination')[0].getElementsByTagName("li").length - 2].innerText)
        };
      });

      // console.log(pageresult.text);
      await browser.close();
      callback(pageresult.text, pageresult.pagenum)
    } catch {
      callback('server error')
    }
  })();
}

function getsingersonglist(singer, callback, pagenum) {
  return (async () => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      // if (pagenum) {
      //   await page.goto("https://www.kkbox.com/hk/en/search.php?search=song&word=" + singer + "&sort=01", {
      //     waitUntil: 'load'
      //   });
      // } else {
      await page.goto("https://www.kkbox.com/hk/en/search.php?search=song&word=" + singer + "&sort=01&cur_page=" + pagenum, {
        waitUntil: 'load'
      });
      // }

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
      callback(pageresult.text, pageresult.pagenum)
    } catch {
      callback('server error')
    }
  })();
}




function getpage(link, callback) {
  try {
    if (link.indexOf('guitarians.com/chord') != -1) {
      return (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('section-part')[0].innerText
            };
          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('polygonguitar.blogspot.com') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('post-body')[0].innerText
            };
          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('daydayguitar.blogspot.com') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByTagName('article')[0].innerText
            };
          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('blog.xuite.net') != -1) {
      // return callback('not supported');
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          await page.goto(link, {
            waitUntil: 'load'
          });

          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('blogbody')[0].innerText.split('--------------')[0]
            };
          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('91pu.com') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });

          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('tone')[0].innerText
            }

          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('tabs.ultimate-guitar.com') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByTagName('code')[0].innerText
            }

          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('chord4.com/tabs') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByTagName('pre')[0].innerText
            }

          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('chords-and-tabs.net') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('contentdiv')[0].innerText
            }

          });

          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        } catch {
          callback('server error')
        }
      })();
    } else if (link.indexOf('polygon.guitars') != -1) {
      (async () => {
        try {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link, {
            waitUntil: 'load'
          });
          const pageresult = await page.evaluate(() => {
            var allline = document.getElementsByClassName('cnl_page')[0].getElementsByClassName('cnl_line');
            var tempresult = ''
            for (var j = 0; j < allline.length; j++) {
              var tempallchord = allline[j].getElementsByClassName('chord')
              for (var k = 0; k < tempallchord.length; k++) {
                tempresult += tempallchord[k].innerText
              }
              tempresult += '\n'
              var tempalllyric = allline[j].getElementsByClassName('lyric')
              for (var k = 0; k < tempalllyric.length; k++) {
                tempresult += tempalllyric[k].innerText
              }
              tempresult += '\n'
            }
            console.log(tempresult)
            return {
              text: tempresult
            };
          });

          var tempresult = pageresult.text
          for (var j = 0; j < tempresult; j++) {
            if (tempresult[j] == '\n') {
              tempresult[j] = '\0'
            }
          }
          // console.log(tempresult);
          await browser.close();
          callback(tempresult)
        } catch {
          callback('server error')
        }
      })();
    } else {
      callback('not supported')
    }
  } catch (e) {
    console.log(e)
    callback('server error')
  }



}

function replaceallline(x) {
  while (x.indexOf('\n') != -1) {
    x = x.replace('\n', '')
  }
  return x
}

const server = app.listen(8000, function () {
  console.log("Working on port 8000");
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // socket.emit('news', {
  //   hello: 'world'
  // });
  // socket.on('my other event', (data) => {
  //   console.log(data);
  // });
});