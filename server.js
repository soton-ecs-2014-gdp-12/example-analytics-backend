/* jshint node: true */
'use strict';

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var bodyParser = require('body-parser');

var fs = require('fs');
var path = require('path');

function startServer() {

	app.use('/', express.static('app'));

	app.all('*', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers",
		           "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.use(bodyParser.json());

	app.options('/log', function(req, res) {
		res.sendStatus(200);
	});

	var socket = null;

	app.ws('/', function(ws, req) {
		socket = ws;

		if (output.length !== 0) {
			console.log("sending recorded output");
			output.forEach(function(d) {
				socket.send(JSON.stringify(d));
			});
		}
	});

	app.post('/log', function(req, res) {
		console.log(JSON.stringify(req.body, null, 4));

		if (socket !== null) {
			socket.send(JSON.stringify(req.body));
		}

		res.send({ status: "ok" });
	});

	app.listen(5001);

	console.log("listening on http://localhost:5001/");
}

var argv = require('minimist')(process.argv.slice(2));
var output = [];

if ("output" in argv) {
	var filePath = path.join(__dirname, argv["output"]);

	fs.readFile(filePath, {encoding: 'utf-8'}, function(err, data){
		if (err) {
			console.log(err);
			return;
		}

		console.log("loaded recorded output");

		output = JSON.parse(data);

		startServer();
	});
} else {
	startServer();
}
