var osc = require("osc-min");
var dgram = require("dgram");
var http = require("http");
var ioClient = require("socket.io-client");

var EventEmitter = require("events").EventEmitter;


function SocketOSCRelay() {

	this.sock = null;

	this.osc_port = null;
	this.bindings = [];

}

var p = SocketOSCRelay.prototype = new EventEmitter();

p.init = function(aServerIP, aServerPort, aOscPort){

	this.osc_port = aOscPort;

	this.sock = ioClient("http://" + aServerIP + ":" + aServerPort);
	this.sock.on("connect", function(){
		console.log("connected!");
	});
	this.sock.on("data", function(data){
		for (var i=0; i < this.bindings.length; i++){
			if (this.bindings[i] == data.macaddress){
				this.sendOSCMessage(this.bindings[i].osc, data);
			}
		}
	}.bind(this));

	// this.server = http.createServer(function(req, res){
	// 	res.writeHead(200, {
	// 		'Content-Type': 'text/html',
	// 		'Access-Control-Allow-Origin' : '*'
	// 	});
	// 	res.end("io only");
	// });

	// this.io = socketio(this.server);
	// this.server.listen(aSocketPort);

	// this.io.on("connection", function(socket){

	// 	console.log("client connected");
	// 	this.clients.push(socket);

	// 	socket.on("disconnect", function(){
	// 		var index = this.clients.indexOf(socket);
	// 		console.log("client at index " + index + " disconnected");
	// 		if (index > -1){
	// 			this.clients.splice(index, 1);
	// 		}
	// 	}.bind(this));

	// }.bind(this));
};

p.addBinding = function(address, oscAddress) {
	this.bindings.push({
		address : {
			osc : oscAddress
		}
	});
};

p.sendOSCMessage = function(tAddress, tData){
	var buf;
	buf = osc.toBuffer({
		address: tAddress,
		args: [ tData ]
	});
	return udp.send(buf, 0, buf.length, this.osc_port, "localhost");
};


// p.addOscPort = function(aOscPort) {

// 	var port_data = {
// 		port : aOscPort,
// 		sock : null
// 	};

// 	console.log("*** SocketOSCRelay listening on osc_port " + aOscPort + " ***");

// 	// Incoming OSC data osc_port

// 	port_data.sock = dgram.createSocket("udp4", function(msg, rinfo){

// 		try {

// 			var dataObj = osc.fromBuffer(msg);
// 			if (dataObj){
// 				this.sendToSockets(dataObj.address, dataObj.args);
// 			}

// 		} catch(_error) {
// 			error = _error;
// 			console.log(error);
// 			console.log("Invalid OSC packet");
// 		}


// 	}.bind(this));

// 	port_data.sock.bind(port_data.port);

// 	this.osc_ports.push(port_data);

// };

// p.sendToSockets = function(address, data){
// 	try {
// 		// console.log(address, data);
// 		this.io.emit(address, data);
// 	} catch(e){
// 		console.log(e);
// 	}
	
// };

module.exports = SocketOSCRelay;

