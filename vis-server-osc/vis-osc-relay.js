var OSCSocketRelay = require("./OSCSocketRelay.js");
var SocketOSCRelay = require("./SocketOSCRelay.js");


var RELAY_PORTS = [
	8887
];

var RELAY_SOCKETS_1 = [
	
];

var relay_pd = new OSCSocketRelay();
relay_pd.init(88);

for (var i=0; i < RELAY_PORTS.length; i++){

	relay_pd.addOscPort(RELAY_PORTS[i]);
	
}

var relay_flic = new 



