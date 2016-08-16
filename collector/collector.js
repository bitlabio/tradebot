//record ticker data from poloniex to mongodb
//calculate delta in 1tick, 1minute, 5minute, 1hour, 1day, 10day intervals.
//be able to tell me what is the fastest growing share right now.

/*

npm install mongojs 

*/

var mongojs = require('mongojs')
var db = mongojs('tradebot',["collector_polo"])

console.log("polo collector3")



/// https://poloniex.com/public?command=returnTicker

var https = require('https');
var polotick = function(cb) {

	var buffer = "";

	var options = {
	  host: 'poloniex.com',
	  port: 443,
	  path: '/public?command=returnTicker',
	  method: 'GET'
	};

	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		if (res.statusCode == 200) {
	  		//console.log('HEADERS: ' + JSON.stringify(res.headers));		
	  		var buffer = "";
		} else {
			console.log('STATUS: ' + res.statusCode);
		}
	  
	  
	  res.on('data', function (chunk) {
	    //console.log('BODY: ' + chunk);
	    buffer += chunk
	  });

	  res.on('end', function () {
	  	//console.log("end.")
	  	//console.log();
	  	var jsontick = JSON.parse(buffer);
	  	jsontick.timestamp = Date.now();
	  	db.collector_polo.save(jsontick, function (err,res) {
			console.log(jsontick)
			console.log(res)
		});
	  })

	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	// write data to request body
	//req.write('data\n');
	//req.write('data\n');
	req.end();
}

polotick()


var interval = setInterval( function() { polotick(); } , 60000 ); // 1 per minute;



/*
connection.onopen = function (session) {
	function marketEvent (args,kwargs) {
		//console.log(args);
	}
	function tickerEvent (args,kwargs) {
		//console.log(args);
		console.log('.');
		var tick = {}
		tick.currencyPair 	= args[0];
		tick.last 			= args[1]; 
		tick.lowestAsk 		= args[2]; 
		tick.highestBid 	= args[3]; 
		tick.percentChange 	= args[4]; 
		tick.baseVolume 	= args[5]; 
		tick.quoteVolume 	= args[6]; 
		tick.isFrozen 		= args[7]; 
		tick.dayHigh 		= args[8]; 
		tick.dayLow 		= args[9]; 
		tick.timestamp		= Date.now();
		
		db.ticks.save(tick, function (err,res) {
			console.log(tick)
			console.log(res)
		});
		

	}
	function trollboxEvent (args,kwargs) {
		//console.log(args);
	}
	//session.subscribe('BTC_XMR', marketEvent);
	session.subscribe('ticker', tickerEvent);

	//session.subscribe('trollbox', trollboxEvent);
}

connection.onclose = function () {
  console.log("Websocket connection closed");
}
		       
connection.open();

*/