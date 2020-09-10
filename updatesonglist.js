var schedule = require('node-schedule');
var fs = require('fs');
var chord4_songlist = require('./songlistgen/chord4_songlist')
var guitarians_songlist = require('./songlistgen/guitarians_songlist')
var kkbox_canton_songlist = require('./songlistgen/kkbox_canton_songlist')
var kkbox_chinese_songlist = require('./songlistgen/kkbox_chinese_songlist')
var kkbox_english_songlist = require('./songlistgen/kkbox_english_songlist')
var kkbox_local_songlist = require('./songlistgen/kkbox_local_songlist')
var polygon_songlist = require('./songlistgen/polygon_songlist')
var spotify_canton_songlist = require('./songlistgen/spotify_canton_songlist')
var spotify_songlist = require('./songlistgen/spotify_songlist')


async function getall() {
    // console.log('The answer to life, the universe, and everything!');
    var mydata = {}
    mydata.chord4_songlist = await chord4_songlist.getdata()
    console.log('chord4')
    mydata.guitarians_songlist = await guitarians_songlist.getdata()
    console.log('guitarians')
    mydata.kkbox_canton_songlist = await kkbox_canton_songlist.getdata()
    console.log('kkbox canton')
    mydata.kkbox_chinese_songlist = await kkbox_chinese_songlist.getdata()
    console.log('kkbox chinese')
    mydata.kkbox_english_songlist = await kkbox_english_songlist.getdata()
    console.log('kkobx eng')
    mydata.kkbox_local_songlist = await kkbox_local_songlist.getdata()
    console.log('kkbox local')
    mydata.polygon_songlist = await polygon_songlist.getdata()
    console.log('polygon')
    mydata.spotify_canton_songlist = await spotify_canton_songlist.getdata()
    console.log('spotify canton')
    mydata.spotify_songlist = await spotify_songlist.getdata()
    console.log('spotify')
    fs.writeFile('public/songlist.json', JSON.stringify(mydata), function (err) {
        if (err) return console.log(err);
        console.log('ok');
    });
}

var rule = new schedule.RecurrenceRule();
rule.minute = 42;

var startschedule = function () {
    schedule.scheduleJob(rule, function () {
        getall()
        // console.count()
    });
}


module.exports.start = startschedule;
module.exports.getall = getall;
// var job = schedule.scheduleJob(rule, getall);

// getall()