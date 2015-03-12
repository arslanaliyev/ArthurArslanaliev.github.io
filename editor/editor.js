var getSelectedText = function () {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
};

var getSelectedColor = function (el) {
    var selected = $(el).find(':selected').css('background-color');
    $(el).css('background-color', selected);
    return selected;
};

var decorateFontColor = function(text, color) {
    var span = '<span style="color:' + color + '">' + text + '</span>';
    var textArea = $('#textarea');
    var allText = textArea.text();
    var decorated = allText.replace(new RegExp(text), span);

    textArea.html(decorated);
    console.log(decorated);
};


$(document).ready(function () {

    $('#font-color').change(function () {
        var color = getSelectedColor(this);
        var selection = getSelectedText();
        decorateFontColor(selection, color);

    }).change();


});
