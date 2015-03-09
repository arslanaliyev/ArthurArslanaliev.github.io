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

    var fillSelect = function (select, options) {
        var opts = [];

        _.each(options, function (option) {
            opts.push('<option value="' + option + '">' + option + '</option>')
        });

        $(select).html(opts.join());
    };

    var fillYearSelect = function (select) {
        var years = _.range(1930, new Date().getFullYear());
        fillSelect(select, years);
    };

    var fillMonthSelect = function (select) {
        var months = _.range(1, 13);
        fillSelect(select, months);
    };

    var fillDaySelect = function (numberOfDays, select) {
        var days = _.range(1, numberOfDays + 1);
        fillSelect(select, days);
    };

    var daysInMonth = function (month, year) {
        return new Date(year, month, 0).getDate();
    };

    $(document).ready(function () {
        var birthSelect = $('#birthYear'),
            monthSelect = $('#month');

        fillYearSelect(birthSelect);

        fillMonthSelect(monthSelect);

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

        birthSelect.change(function () {
            var year = $(this).find(':selected').text(),
                month = $('#month').find(':selected').text();

            fillDaySelect(daysInMonth(month, year), $('#day'));
        });

        monthSelect.change(function () {
            var year = $('#birthYear').find(':selected').text(),
                month = $(this).find(':selected').text();

            fillDaySelect(daysInMonth(month, year), $('#day'));
        });

        monthSelect.change();
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

