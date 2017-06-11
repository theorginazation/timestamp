// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var monthNames = ["january", "february", "march", "april", "may", "june", "july",
                  "august", "september", "october", "november", "december"];
var months = [31,28,31,30,31,30,31,31,30,31,30,31];

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


function parseDate(req, res) {
  
  var date = req.params.date.replace(/[^\w\s]|_/g, " ").replace(/\s+/g, " ");
  var monthLetters = extractLetters(date);
  var monthName = findMonth(monthLetters);
  
  var minusMonth = date.slice(0, date.indexOf(monthLetters)) + date.slice(date.indexOf(monthLetters) + monthLetters.length);
  var splitDate = orderDate(minusMonth.split(' '));
  
  if (monthLetters.length < 3 || monthName.length !== 1) res.send({unix: null, natural: null});
  else {
    var timeStamp = toUnixTimestamp(splitDate.year, monthNames.indexOf(monthName[0])+1, splitDate.day);
    res.send({unix: timeStamp, natural: `${monthName} ${splitDate.day}, ${splitDate.year}`})
  }
}

function toUnixTimestamp(year, month, day) {
  var timestamp = 0;
  timestamp += (year - 1970) * 86400 * 365;
  var days = 0;
  for (var i = month - 1; i >= 0; i--) {
    days += months[i];
  }
  days -= months[month-1] - day;
  return timestamp + days * 86400;
}

function extractLetters(string) {
  var letters = '';
  for (var i = 0; i < string.length; ++i) {
    var letter = string[i].toLowerCase();
    if (!/\d/.test(letter)) letters += letter;
  }
  
  return letters.replace(/\s/g, '');
}

function findMonth(letters) {
  var test = monthNames.filter(function(e) {
    return e.indexOf(letters) === 0;
  })
  return test;
}

function orderDate(dateArray) {
  var date = {};
  for (var i = 0; i < dateArray.length; ++i) {
    if (dateArray[i].length <=2 && dateArray[i] > 0) date.day = Number(dateArray[i]);
    else if (dateArray[i].length >2 ) date.year = Number(dateArray[i]);
  }
  return date;
}

// http://expressjs.com/en/starter/basic-routing.html
app.get("/:date", parseDate);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
