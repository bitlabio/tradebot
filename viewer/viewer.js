/*

npm install express mongojs cookie-parser cookie-session body-parser socket.io


*/

console.log("tradebot viewer running on port 8080")

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
var compression = require('compression')


app.use(compression())

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

var zip = new require('node-zip')();

//zip data
app.get('/datazip', function (req, res) {
	db.collector_polo.find( {}, function (err, dbresp) {
		var dbresptxt = JSON.stringify(dbresp)
		zip.file('data.txt', dbresptxt)
		var sendthis = zip.generate({base64:false,compression:'DEFLATE'});
		res.writeHead(200, { 'Content-Type' : 'application/zip', 'Content-disposition': 'attachment; filename=datazip.zip'});
		res.write( new Buffer(sendthis, 'binary'));
		res.end();
	});
})
//zip data end

app.get('/api/datainfo', function(req, res) {
	db.collector_polo.count( {}, function (err, count) {
		db.collector_polo.find().limit(1).sort( {timestamp: 1}, function (err, first) {
			db.collector_polo.find().limit(1).sort( {timestamp: -1} , function (err, last) {
				
				var info = {
					length : count,
					starttime : first[0].timestamp,
					endtime: last[0].timestamp
				}
				res.json(info);

			});
		});
	});
})

//data json api
app.get('/api/data', function(req, res) {
	db.collector_polo.find( {}, function (err, dbresp) {
		var dbresptxt = JSON.stringify(dbresp)
		//console.log(dbresp.length);
		res.end(dbresptxt);
	});
});

app.get('/api/databytimestamp', function(req, res) {
	console.log('databytimestamp:')
	console.log(req.query)
	db.collector_polo.findOne({timestamp:parseInt(req.query.timestamp)}, function (err, dbresp) {
		console.log('sent.')
		res.end(JSON.stringify(dbresp))
	})
})

app.get('/api/datafind', function(req, res) {
	console.log(req.query)
	var lte = parseInt(req.query.lte)
	var gte = parseInt(req.query.gte)
	
	db.collector_polo.find( { timestamp: { '$lte' : lte, '$gte': gte}}, function (err, dbresp) {
		console.log('sent '+dbresp.length + 'entries')
		var times = []
		for (var d in dbresp) { times.push(dbresp[d].timestamp)}
		//var dbresptxt = JSON.stringify(dbresp)
		res.end(JSON.stringify(times));
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

