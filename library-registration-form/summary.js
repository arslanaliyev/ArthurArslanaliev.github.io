(function() {

    'use strict';

    var key = 'libraryForm';

    var getHtml = function(formData) {
        var out = [];
        formData.forEach(function(item) {
            if (typeof (item.value) === 'boolean') {
                if (item.value) {
                    item.value = 'Yes';
                } else {
                    item.value = 'Nope';
                }
            } else {
                if (!item.value.length) {
                    item.value = '—';
                }
            }
            out.push('<div>' + item.key + ': ' + item.value + '</div>');
        });
        return out.join('');
    };


    $(document).ready(function () {
        var formData = JSON.parse(localStorage.getItem(key)),
            container = $('.summary-fields');

        $(container).html(getHtml(formData));

        localStorage.removeItem(key);
    })
})();