/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
require('./../public/js/Util.js');
var UUID = require('node-uuid'),
    CONFIG = require('./../public/js/Configuration.js'),
    CONN = require('./../public/js/Connection.js');

var GameServer = Object.extend({
    initialize : function(app){
        this.app = app;
    },

    addClient : function(req){

    },

    removeClient : function(req){

    }
});
module.exports = GameServer;