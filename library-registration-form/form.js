$(document).ready(function () {
    $('button').click(function () {
        $.each($('[data-mandatory]'), function (_, field) {
            var value = $.trim($(field).val());
            if (!value) {
                $(field).showWarning('This field is mandatory');
            } else {
                $(field).hideWarning();
            }
        });
    });

    $.fn.showWarning = function (msg) {
        $(this).addClass('warning')
            .next().css('visibility', 'visible').text(msg);
    };

    $.fn.hideWarning = function () {
        $(this).removeClass('warning')
            .next().css('visibility', 'hidden');
    };
});