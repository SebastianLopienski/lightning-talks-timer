var PORT = "26544";

var
url    = require('url'),
fs     = require('fs'),
os     = require('os'),
crypto = require('crypto'),
dns    = require('dns'),
http   = require('http');

var timer = {ts: 0}, seconds;
var token;

if (process.argv.length < 3 || process.argv[2] == "") {
	token = crypto.randomBytes(20).toString('hex');
} else {
	token = process.argv[2];
}

if (process.argv.length > 3) {
	talkMinutes = parseInt(process.argv[3]);
} else {
	talkMinutes = 5;
}

if (process.argv.length > 4) {
	qaMinutes = parseInt(process.argv[4]);
} else {
	qaMinutes = 2;
}

http.createServer(function (req, res) {
	reqDetails = url.parse(req.url, true);

	if (reqDetails.pathname == '/get') {
		process.stdout.write('.');
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(timer));
	} else if (reqDetails.pathname == '/set' && reqDetails.query.token == token) {
		console.log("\n" + req.url);
		if (reqDetails.query.talk != null)
			timer = {warn: 45*1000, ts: Date.now()+talkMinutes*60*1000};
		else if (reqDetails.query.questions != null)
			timer = {warn: 10*1000, ts: Date.now()+qaMinutes*60*1000, desc: 'questions and answers'};
		else if (reqDetails.query.add10 != null && timer.ts != 0)
			timer.ts += 10*1000;
		else if (!isNaN(seconds = parseInt(reqDetails.query.set)))
			timer = {warn: seconds*200, ts: Date.now()+seconds*1000, desc: timer.desc};
		else if (reqDetails.query.stop != null)
			timer = {ts: 0};
		console.log(timer);
		res.end(JSON.stringify(timer));
	} else if (reqDetails.pathname == '/index.html' ||
		reqDetails.pathname == '/admin.html' ||
		reqDetails.pathname == '/timer-client.js') {

		console.log("\n" + req.url);
		res.writeHead(200, {'Content-Type': 'text/html'});

		fs.readFile("." + reqDetails.pathname, "binary", function(err, file) {
			if(err) {
				res.write(err + "\n");
				res.end();
			} else {
				res.writeHeader(200);
				res.write(file, "binary");
				res.end();
			}
		});

	} else {
		console.log("\n" + req.url);
		res.end("Unknown request");
	}

}).listen(PORT);

function getInterfaceIP4address(anInterface)
{
	for (var k in anInterface) {
        var address = anInterface[k];
        if (address.family === 'IPv4' && !address.internal) {
        	return address.address;
        }
    }
}

function getIP4address()
{
	var networkInterfaces = os.networkInterfaces();
	if ("eth0" in networkInterfaces) {
		return getInterfaceIP4address(networkInterfaces["eth0"])
	}
	if ("en0" in networkInterfaces) {
		return getInterfaceIP4address(networkInterfaces["en0"])
	}
}

console.log('Talk time: '+talkMinutes+' minutes');
console.log('Q&A time:  '+qaMinutes+' minutes\n');

console.log('Timer running at:');
console.log('       http://'+os.hostname()  +':'+PORT+'/index.html');
console.log('       http://'+getIP4address()+':'+PORT+'/index.html');
console.log('Admin panel running at:');
console.log('       http://'+os.hostname()  +':'+PORT+'/admin.html#'+token);
console.log('       http://'+getIP4address()+':'+PORT+'/admin.html#'+token);

console.log('\nPS: this timer doesn\'t work on IE; use FF, Chrome, Safari etc.');
