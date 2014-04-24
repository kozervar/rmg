/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
var Network = Object.extend({

    id: null,

    netLatency: 0.001,
    netPing: 0.001,
    lastPingTime: 0.001,
    fakeLag: 0,

    sessionEstablishedSignal: new Phaser.Signal(),
    sessionLostSignal: new Phaser.Signal(),

    clientConnectedSignal: new Phaser.Signal(),
    clientDisconnectedSignal: new Phaser.Signal(),

    initialize: function () {
    },

    connect: function () {
        console.debug('Connecting to server.');
        if (this.socket == null) {
            this.socket = io.connect(null, {
                'auto connect': false,
                'sync disconnect on unload': true
            });

            this.socket.on(window.CONN.CONNECT, this.onConnect.bind(this));
            this.socket.on(window.CONN.DISCONNECT, this.onDisconnect.bind(this));
            this.socket.on(window.CONN.SESSION, this.onSessionEstablished.bind(this));
            this.socket.on(window.CONN.MESSAGE, this.onServerMessage.bind(this));
        }
        this.socket.socket.connect();
    },

    onConnect: function () {
        console.debug('Connected to server.');
        this.socket.emit(window.CONN.CONNECTED);
    },
    onDisconnect: function () {
        this.sessionLostSignal.dispatch(this.id);
        console.debug('Disconnected from server.');
        this.socket.disconnect();
    },
    onSessionEstablished: function (session) {
        console.debug('Session established. UUID: ' + session.UUID);
        var self = this;
        // create ping timer
        setInterval(function () {
            self.lastPingTime = new Date().getTime() - self.fakeLag;
            self.socket.send(window.CONN.PING + '#' + (self.lastPingTime));
        }.bind(this), 1000);

        this.id = session.UUID;

        this.sessionEstablishedSignal.dispatch(this.id);
    },

    onServerMessage: function (data) {
        var commands = data.split('#');
        var command = commands[0];
        var data = commands[1] || null;
        switch (command) {
            case window.CONN.PING : //server ping
                this.onServerPing(data);
                break;
            case window.CONN.CLIENT_CONNECTED :
                this.onClientConnected(data);
                break;
            case window.CONN.CLIENT_DISCONNECTED :
                this.onClientDisconnected(data);
                break;
        } //subcommand
    },

    onServerPing: function (data) {
        this.netPing = new Date().getTime() - parseFloat(data);
        this.netLatency = this.netPing / 2;
    },

    onClientConnected: function (data) {
        this.clientConnectedSignal.dispatch(data);
    },

    onClientDisconnected: function (data) {
        this.clientDisconnectedSignal.dispatch(data);
    }
});
