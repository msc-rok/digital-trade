

global.config = require('../server/config');

var express = require('express');
var app = express();

app.use(express.static('public'));

// logs every request
app.use(function(req, res, next){
    // output every request in the array
    console.log({method:req.method, url: req.url, device: req.device});

    // goes onto the next function in line
    next();
});

require('./routes')(app);

var runningPortNumber = process.env.PORT || 3000;

var server = app.listen(runningPortNumber, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);

});