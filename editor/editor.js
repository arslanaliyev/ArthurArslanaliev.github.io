(function () {

    'use strict';

    var charObjects = [],
        isSelectBoxOpened = false,
        colorMap = {
            'plum': '#9B4B87',
            'slateGrey': '#1F282C',
            'emerald': '#377D6E',
            'yellow': '#FF9632',
            'blue': '#0079A5'
        };

    var getSelected = function () {
        if (typeof window.getSelection !== 'undefined') {
            var selection = window.getSelection();
            if (selection.rangeCount && selection.rangeCount >= 1) {
                var range = selection.getRangeAt(0);
                var start = range.startContainer;
                var end = range.endContainer;

                if (start && end) {
                    return {
                        start: parseFloat(start.parentNode.id),
                        end: parseFloat(end.parentNode.id)
                    };
                }
            }
        }

    };

    var removeSelection = function () {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {  // IE?
            document.selection.empty();
        }
    };

    var fillInCharObjects = function (text) {
        charObjects = [];

        _.each(text, function (ch, index) {
            charObjects.push({"char": ch, "index": index, "style": {}});
        });
    };

    var wrapCharsInSpans = function (charObjects) {
        var html = [];

        _.each(charObjects, function (obj) {
            var _span = document.createElement('span');
            var container = document.createElement('div');
            _span.textContent = obj.char;
            _span.id = obj.index;
            if (obj.style) {
                if (obj.style.color) {
                    _span.style.color = obj.style.color;
                }
            }

            container.appendChild(_span);
            html.push(container.innerHTML);
        });

        return html.join('');
    };

    var setControlColor = function (el) {
        var selectedOption = $(el).find(':selected');
        var color = colorMap[selectedOption[0].value];
        $(el).css('background-color', color);
        return color;
    };

    var setColorToCharObjects = function (start, end, color) {
        _.each(charObjects, function (obj, index) {
            if (index >= start && index <= end) {
                obj.style.color = color;
            }
        });
    };

    $(document).ready(function () {

        var div = $('#textarea'),
            fontColorSelect = $('#font-color');

        fillInCharObjects(div.text());

        div.html(wrapCharsInSpans(charObjects));

        fontColorSelect.click(function () {
            if (isSelectBoxOpened) {
                var color = setControlColor($(this));
                var indexes = getSelected();
                if (indexes) {
                    setColorToCharObjects(indexes.start, indexes.end, color);
                    div.html(wrapCharsInSpans(charObjects));
                    removeSelection();
                }
            }
            isSelectBoxOpened = !isSelectBoxOpened;
        });

        fontColorSelect.blur(function () {
            if (isSelectBoxOpened) {
                isSelectBoxOpened = false;
            }
        });
    });
})();



