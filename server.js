/* jshint node: true */
'use strict';

var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var bodyParser = require('body-parser');

app.use(express.static(__dirname));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(bodyParser.json());

app.options('/log', function(req, res) {
	res.sendStatus(200);
});

var socket = null;

app.ws('/', function(ws, req) {
	socket = ws;
});

app.post('/log', function(req, res) {
	console.log(req.body);
	if (socket !== null) {
		socket.send(JSON.stringify(req.body));
	}

	res.send({ status: "ok" });
});

app.listen(5000);
