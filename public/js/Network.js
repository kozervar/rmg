/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
var Network = Class.create({

    initialize : function(){
        console.debug('Connecting to server.');
        if (this.socket == null) {
            this.socket = io.connect(null, {
                'auto connect': false,
                'sync disconnect on unload': true
            });

            this.socket.on('connect', this.onConnect.bind(this));
            this.socket.on('disconnect', this.onDisconnect.bind(this));
        }
        this.socket.socket.connect();
    },

    onConnect : function(){
        console.debug('Connected to server.');
    },
    onDisconnect : function(){
        console.debug('Disconnected from server.');
    }
});
