/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */

var CONN = {
    CONNECT     : 'connect',
    DISCONNECT  : 'disconnect',
    MESSAGE     : 'message',
    CONNECTED   : 0,
    DISCONNECTED: 1,
    SESSION     : 2,
    PING        : 'p',
    CLIENT_CONNECTED    : 'cc',
    CLIENT_DISCONNECTED    : 'cd'
};

if (typeof module !== 'undefined') { // server side
    module.exports = CONN;
} else {                             // clients and smarthphones
    window.CONN = CONN;
}