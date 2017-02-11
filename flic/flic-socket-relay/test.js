var socketio = require("socket.io");
var http = require("http");
var express = require("express");
var app = express();


var sockClients = [];

var server = app.listen(80);
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

	// send test data
	sendToSockets("data", {
		macaddress : "test:test:test:test",
		eventType : "click",
		value : "ButtonUp"
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

