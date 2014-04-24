/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
require('./../public/js/Util.js');
var UUID = require('node-uuid'),
    CONFIG = require('./../public/js/Configuration.js'),
    CONN = require('./../public/js/Connection.js');

var GameServer = Object.extend({

    serverTime: null,
    players: [],

    initialize: function (app) {
        this.app = app;
        this.serverTime = new Date().getTime();
    },

    addClient: function (req) {
        var uuid = req.session.UUID;
        this.players.push({id: uuid});
        console.log("Player added: " + uuid);
    },

    removeClient: function (req) {
        var uuid = req.session.UUID;
        console.log("Player removed: " + uuid);
        this.players = _.filter(this.players, function (value) {
            if (value.id === uuid) return undefined;
            return value;
        });
    }
});
module.exports = GameServer;