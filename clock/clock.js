(function () {

    'use strict';

    var callback = function () {
        setTime();

        setInterval(setTime, 1000);
    };

    var setTime = function () {
        document.getElementById('clock')
            .getElementsByTagName('span')[0].innerText = new Date().toLocaleTimeString();
    };

    var onDomIsReady = function (callback) {
        if (document.readyState != 'loading') {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    };

    onDomIsReady(callback);

})();