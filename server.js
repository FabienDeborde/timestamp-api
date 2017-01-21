var express = require("express");

var app = express();

app.get('*', function (req, res) {
  var date = req.path.substring(1); // Cut out the 1st /
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; // Months list
  // The date object containing both formats to return
  var dateObj = {
    'unix': 0,
    'natural': ''
  };
  // Declare date components var
    var year = 0;
    var month = "";
    var day = 0;
  // RegEx to search for 'natural' format, naturalResult will output an object if it's a match, if not it returns null
  var naturalRegEx = /^([a-zA-Z]*)%20(\d{2}),%20(\d{4})$/;
  var naturalResult = date.match(naturalRegEx);
  // RegEx to search for unix format, unixResult will output an object if it's a match, if not it returns null
  var unixRegex = /^\d*$/;
  var unixResult = date.match(unixRegex);

  if (naturalResult) {  // Check if it's a 'natural' date format
    // Get the date info
    year = naturalResult[3];
    month = naturalResult[1];
    day = naturalResult[2];
    // Format the date and insert the values inside the dateObj object
    var monthISO = (months.indexOf(month)+1);
    var dateISO8601 = year + '-' + monthISO + '-' + day;
    dateObj.natural = month + ' ' + day + ', ' + year;
    dateObj.unix = (Date.parse(dateISO8601)/1000);
  } else if (unixResult) {  // Check if it's a unix date format
    // Get the date info
    var d = parseInt(date, 10); // Change the date from String to Number
    var unixDate = new Date(d *1000); // Create new date from the unix timestamp (took me a while to understand this timestamp was not in milliseconds)
    year = unixDate.getFullYear();
    month = months[unixDate.getMonth()];
    day = unixDate.getDate();
    // Format the date and insert the values inside the dateObj object
    dateObj.unix = d;
    dateObj.natural = month + ' ' + day + ', ' + year;
  } else {   // If it's neither a 'natural' nor a unix date format
    // Ouput an error message
    console.error('Wrong date format');
    dateObj = null;
  }
  // res.end can't output an object so we need to stringify it
  res.end(JSON.stringify(dateObj));
});



app.listen(process.env.PORT, function () {
  console.log('Timestamp app listening on port ' + process.env.PORT + '!');
});