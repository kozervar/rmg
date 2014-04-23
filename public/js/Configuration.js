/**
 * Created by Marcin Kozaczyk on 23.04.14.
 */
(function () {

    var CONFIG = {
        PORT: 4004
    };

    if (typeof module !== 'undefined') { // server side
        module.exports = CONFIG;
    } else {                             // clients and smarthphones
        var application = {};
        window.CONFIG = CONFIG;
    }
})();