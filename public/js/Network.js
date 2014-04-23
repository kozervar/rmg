/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
var Network = Object.extend({

    initialize : function(main){
        this.main = main;
        console.debug('Connecting to server.');
        if (this.socket == null) {
            this.socket = io.connect(null, {
                'auto connect': false,
                'sync disconnect on unload': true
            });

            this.socket.on('connect', this.onConnect.bind(this));
            this.socket.on('disconnect', this.onDisconnect.bind(this));
            this.socket.on(window.CONN.SESSION, this.onSessionEstablished.bind(this));
        }
        this.socket.socket.connect();
    },

    onConnect : function(){
        console.debug('Connected to server.');
        this.socket.emit(window.CONN.CONNECTED);
    },
    onDisconnect : function(){
        console.debug('Disconnected from server.');
        this.socket.disconnect();
    },
    onSessionEstablished : function(session){
        console.debug('Session established. UUID: ' + session.UUID);
        this.main.start();
    }
});
