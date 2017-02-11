var socketio = require("socket.io");
var http = require("http");
var express = require("express");
var app = express();


var fliclib = require("./fliclibNodeJs");
var FlicClient = fliclib.FlicClient;
var FlicConnectionChannel = fliclib.FlicConnectionChannel;
var FlicScanner = fliclib.FlicScanner;

var client = new FlicClient("localhost", 5551);

var sockClients = [];

var server = app.listen(88);
var io = socketio.listen(server);


io.on("connection", function(socket){

	console.log("client connected");
	sockClients.push(socket);

	socket.on("disconnect", function(){
		var index = sockClients.indexOf(socket);
		console.log("client at index " + index + " disconnected");
		if (index > -1){
			sockClients.splice(index, 1);
		}
	});

});


var sendToSockets = function(address, data){
	try {
		// console.log(address, data);
		io.emit(address, data);
	} catch(e){
		console.log(e);
	}
	
};

sendToSockets("data", {
	macaddress : "test:test:test:test",
	eventType : "click",
	value : "ButtonUp"
});