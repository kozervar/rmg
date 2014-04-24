/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
(function () {


    var CONFIG = {
        PORT : 4005,
        SESSION_RELOAD_INT : 10*1000
    };

    if (typeof module !== 'undefined') { // server side
        module.exports = CONFIG;
    } else {                             // clients and smarthphones
        RMG = {};
        window.CONFIG = CONFIG;
    }
})();