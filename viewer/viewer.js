// tradebot server
var config = {}
config.db = "tradebot"
//config.env = "production";
config.env = 'development';

//var env = process.env.NODE_ENV || 'development';
//var env = 'production';


var express   = require('express');
var app       = express();
var fs        = require('fs');
var path      = require("path");


var http = require('http')

var mongojs     = require('mongojs')
var db          = mongojs('tradebot',["collector_polo"])

var cookieParser = require('cookie-parser')
var session = require('cookie-session')

var bodyParser  = require('body-parser');



//app.use(compression())

app.use(session({
  name: 'session',
  secret: "viewer_123655765876",
  secureProxy: false,
  maxAge: 1000*60*60*24*365*100, //100years
}))

//io.sockets.emit("arduino", data)







///////////////////////////////////////////
// WEBSERVER 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('static'));

var apphandler = function (req, res) {
  res.sendFile(path.join(__dirname+'/static/viewer.html'));    
}

app.get('/', apphandler);


app.get('/api/data', function(req, res) {

	db.collector_polo.find( {}, function (err, dbresp) {
		var dbresptxt = JSON.stringify(dbresp)
		//console.log(dbresp.length);
		res.end(dbresptxt);
	});

});


app.get('/process', function(req,res) {
	/*
		loads and processes all tick data
		// options:
		smoothing
		samplerate
	*/
})



httpServer = http.createServer(app);
io = require('socket.io')(httpServer);
httpServer.listen(8080);


///////////////////////////////////////////
// SOCKETS

io.on('connection', function (socket) {
  console.log("socket connected!")

  socket.on('handshake', function(msg){
    console.log('message: ' + msg);
  });
});

