(function () {

    'use strict';

    var message = '.message',
        warning = 'warning';

    var checkMandatory = function (field) {
        var value = $.trim($(field).val());
        if (!value) {
            $(field).showWarning('This field is mandatory');
        } else {
            $(field).hideWarning();
        }
    };

    var checkEmail = function (field) {
        var re = /\S+@\S+\.\S+/;
        var value = $.trim($(field).val());
        if (!re.test(value)) {
            $(field).showWarning('The email format is invalid');
        } else {
            $(field).hideWarning();
        }
    };

    var fillYearSelect = function (select) {
        var start = 1930,
            stop = new Date().getFullYear(),
            years = _.range(start, stop),
            options = [];

        _.each(years, function(year) {
            options.push('<option value="' + year + '">' + year +  '</option>')
        });

        $(select).html(options.join());
    };

    var daysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };

    $(document).ready(function () {

        fillYearSelect($('#birthYear'));

        $('button').click(function () {
            $.each($('input'), function (_, field) {
                var rule = $(field).data();
                if (rule.hasOwnProperty('mandatory')) {
                    checkMandatory(field);
                }
                if (rule.hasOwnProperty('email')) {
                    checkEmail(field);
                }
            });
        });

    });

    $.fn.showWarning = function (msg) {
        if (!$(this).isWarningShown()) {
            $(this).addClass(warning)
                .next(message)
                .css('visibility', 'visible')
                .text(msg);
        }

    };

    $.fn.hideWarning = function () {
        $(this).removeClass(warning)
            .next(message).css('visibility', 'hidden');
    };

    $.fn.isWarningShown = function () {
        return $(this).next(message).css('visibility') === 'visible';
    };

})();

