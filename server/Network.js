/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
require('./../public/js/Util.js');
var UUID = require('node-uuid'),
    CONFIG = require('./../public/js/Configuration.js'),
    CONN = require('./../public/js/Connection.js');

var Network = Object.extend({

    initialize : function(app){
        console.log("Initializing networking");

        app.io.route(CONN.CONNECTED, this.onClientConnect.bind(this));
    },

    onClientConnect : function(req){
        var self = this;
        req.session.UUID = UUID();
        console.log("Client session registered. UUID: " + req.session.UUID);

        req.session.save(function(){
            // BIND
            req.socket.on(CONN.DISCONNECT, self.onSessionDisconnect.bind(self,req));

            req.intervalID = setInterval(function () {
                req.session.reload(self.onSessionReload.bind(self, req));
            }, CONFIG.SESSION_RELOAD_INT);

            req.io.emit(CONN.SESSION, req.session);

        });
    },

    onSessionDisconnect : function(session){
        clearInterval(session.intervalID);
        console.log('Client disconnected UUID: ' + req.session.UUID);
    },

    onSessionReload : function(req){
        console.info("Session RELOAD. UUID " + req.session.UUID);
        req.session.touch().save();
    }
});

// Node server side export
module.exports = Network;