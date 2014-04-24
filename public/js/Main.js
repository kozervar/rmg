/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
var debugGui = new dat.GUI();
var Main = Object.extend({

    players : null,

    initialize: function () {
    },
    start: function (network) {
        this.game = new Phaser.Game(848, 450, Phaser.AUTO, $('#game'));
        this.game.state.add('game', this, true);

        this.network = network;

        this.network.sessionEstablishedSignal.add(this.startSession, this);
        this.network.sessionLostSignal.add(this.sessionLost, this);

        this.network.clientConnectedSignal.add(this.playerConnected, this);
        this.network.clientDisconnectedSignal.add(this.playerDisconnected, this);
    },

    preload: function () {
        this.game.load.image('ground', 'assets/gfx/ground.png');
        this.game.load.image('player', 'assets/gfx/player.png');
        this.game.load.image('rocket', 'assets/gfx/rocket.png');

        this.players = this.game.add.group();

        this.game.load.onLoadComplete.add(this.network.connect, this.network);
    },

    create: function () {
        // Set stage background to something sky colored
        this.game.stage.backgroundColor = 0x4488cc;

        // Define movement constants
        this.GRAVITY = 980; // pixels/second/second

        // Since we're jumping we need gravity
        this.game.physics.arcade.gravity.y = this.GRAVITY;

        // Create some ground for the player to walk on
        this.ground = this.game.add.group();
        for (var x = 0; x < this.game.width; x += 32) {
            // Add the ground blocks, enable physics on each, make them immovable
            var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
            this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
            groundBlock.body.immovable = true;
            groundBlock.body.allowGravity = false;
            this.ground.add(groundBlock);
        }

        // Capture certain keys to prevent their default actions in the browser.
        // This is only necessary because this is an HTML5 game. Games on other
        // platforms may not need code like this.
        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);

        // Just for fun, draw some height markers so we can see how high we're jumping
        this.drawHeightMarkers();

        // Show FPS
        this.game.time.advancedTiming = true;
        this.fpsText = this.game.add.text(
            20, 20, '', { font: '16px Arial', fill: '#ffffff' }
        );
        this.createDebugGui();

    },

    drawHeightMarkers: function () {
        // Create a bitmap the same size as the stage
        var bitmap = this.game.add.bitmapData(this.game.width, this.game.height);

        // These functions use the canvas context to draw lines using the canvas API
        for (var y = this.game.height - 32; y >= 64; y -= 32) {
            bitmap.context.beginPath();
            bitmap.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            bitmap.context.moveTo(0, y);
            bitmap.context.lineTo(this.game.width, y);
            bitmap.context.stroke();
        }

        this.game.add.image(0, 0, bitmap);
    },

    update: function () {
        if (this.game.time.fps !== 0) {
            this.fpsText.setText(this.game.time.fps + ' FPS');
        }

        // Collide the player with the ground
        if (this.player) {
            this.player.collide(this.ground);
        }
        this.players.forEach(function(item){
            item.collide(this.ground);
        },this);
    },

    render: function () {
        //this.game.debug.text("this is debug text", this.player.position.x - 10, this.player.position.y - 10);
//        this.game.debug.text("Delta: " + this.game.time.deltaCap, 10, 80);
//        this.game.debug.text("Elapsed: " + this.game.time.elapsed, 10, 95);
    },

    createDebugGui: function () {

    },

    startSession: function (uuid) {

        this.player = new Player(this, this.game.width / 2, this.game.height - 164, uuid);
        this.player.createPlayer();

        var _time = debugGui.addFolder('Time');
        _time.add(this.game.time, 'fps').listen();
        _time.add(this.game.time, 'deltaCap').listen();
        _time.add(this.game.time, 'elapsed').listen();
        _time.add(this.game.time, 'physicsElapsed').listen();
        _time.add(this.game.time, 'lastTime').listen();
        _time.add(this.game.time, 'now').listen();
        _time.open();
        var _playersettings = debugGui.addFolder('Player');
        _playersettings.add(this.player.position, 'x').listen();
        _playersettings.add(this.player.position, 'y').listen();
        _playersettings.add(this.player.body.acceleration, 'x').listen();
        _playersettings.add(this.player.body.acceleration, 'y').listen();
        _playersettings.open();
        var _netFolder = debugGui.addFolder('Network');
        _netFolder.add(this.network, 'id').listen();
        _netFolder.add(this.network, 'netLatency').listen();
        _netFolder.add(this.network, 'netPing').listen();
        _netFolder.add(this.network, 'lastPingTime').listen();
        _netFolder.add(this.network, 'fakeLag', 0).listen();
        _netFolder.open();
    },

    sessionLost: function (uuid) {
        this.player.destroyPlayer();
        console.debug("Session lost!");
    },

    playerConnected: function (uuid) {
        console.debug("Player connected: " + uuid);
        var p = new Player(this, this.game.world.randomX, this.game.world.randomY, uuid);
        this.players.add(p);
    },

    playerDisconnected: function (uuid) {
        var p = undefined;

        this.players.forEach(function(item){
            if(item.uuid === uuid) p = item;
        },this);

        this.players.remove(p);

        console.debug("Player disconnected: " + uuid);
    }

});
jQuery(document).ready(function () {
    var network = new Network();
    var main = new Main();
    main.start(network);
});