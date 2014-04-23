/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */

var express = require('express.io'),
    app = express().http().io(),
    CONFIG = require('./public/js/Configuration.js'),
    CONN = require('./public/js/Connection.js'),
    Network = require('./server/Network.js');

var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

app.use(express.cookieParser());
app.use(express.session({store: sessionStore, secret: 'monkey', key: 'express.sid'}));
// Session is automatically setup on initial request.
app.get('/', function (req, res) {
    req.session.loginDate = new Date().toString()
    res.sendfile(__dirname + '/public/index.html');
});
app.use(express.static(__dirname + '/public/'));

console.info('Starting server.');
app.listen(CONFIG.PORT, function(){
    console.info('Server started. Port: ' + CONFIG.PORT);
    var net = new Network(app);
});