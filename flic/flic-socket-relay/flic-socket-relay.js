var socketio = require("socket.io");
var http = require("http");

var fliclib = require("./fliclibNodeJs");
var FlicClient = fliclib.FlicClient;
var FlicConnectionChannel = fliclib.FlicConnectionChannel;
var FlicScanner = fliclib.FlicScanner;

var client = new FlicClient("localhost", 5551);

var sockClients = [];

var server = http.createServer(function(req, res){
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Access-Control-Allow-Origin' : '*'
	});
	res.end("io only");
});

var io = socketio(this.server);
server.listen(80);

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

function listenToButton(bdAddr) {
	var cc = new FlicConnectionChannel(bdAddr);
	client.addConnectionChannel(cc);
	cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
		console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
		sendToSockets("data", {
			macaddress : bdAddr,
			eventType : "click",
			value : clickType
		});
	});
	cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
		console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
	});
}

client.once("ready", function() {
	console.log("Connected to daemon!");
	client.getInfo(function(info) {
		info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
			listenToButton(bdAddr);
		});
	});
});

client.on("bluetoothControllerStateChange", function(state) {
	console.log("Bluetooth controller state change: " + state);
});

client.on("newVerifiedButton", function(bdAddr) {
	console.log("A new button was added: " + bdAddr);
	listenToButton(bdAddr);
});

client.on("error", function(error) {
	console.log("Daemon connection error: " + error);
});

client.on("close", function(hadError) {
	console.log("Connection to daemon is now closed");
});
