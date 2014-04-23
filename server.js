/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */

var express = require('express.io'),
    app = express().http().io(),
    UUID = require('node-uuid'),
    CONFIG = require('./public/js/Configuration.js');

app.use(express.static(__dirname + '/public/'));


app.listen(CONFIG.PORT, function(){
    console.info('Server started. Port: ' + CONFIG.PORT);
});