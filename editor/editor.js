(function () {

    'use strict';

    var charObjects = [],
        isFontColorBoxOpened = false,
        isFontFamilyBoxOpened = false,
        colorMap = {
            'plum': '#9B4B87',
            'slateGrey': '#1F282C',
            'emerald': '#377D6E',
            'yellow': '#FF9632',
            'blue': '#0079A5'
        },
        fontMap = {
            'helvetica': 'Helvetica Neue,Helvetica,Arial,sans-serif',
            'papyrus': 'Papyrus, fantasy',
            'century': 'Century Gothic, sans-serif',
            'rockwell': 'Rockwell Extra Bold,Rockwell Bold,monospace',
            'consolas': 'Consolas,monaco,monospace'
        };

    var getSelectedArea = function () {
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
            if (window.getSelection().empty) {
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            }
        } else if (document.selection) {
            document.selection.empty();
        }
    };

    var constructObjChar = function (ch, index, style) {
        return {
            "char": ch,
            "index": index,
            "style": {
                "color": style.color,
                "fontFamily": style.fontFamily,
                "fontStyle": style.fontStyle,
                "fontWeight": style.fontWeight
            }
        }
    };

    var fillInCharObjects = function (text, startIndex) {
        var charObjects = [];

        _.each(text, function (ch, _) {
            charObjects.push(constructObjChar(ch, startIndex, {}));
            startIndex += 1;
        });

        return charObjects;
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
                if (obj.style.fontFamily) {
                    _span.style.fontFamily = obj.style.fontFamily;
                }
                if (obj.style.fontStyle) {
                    _span.style.fontStyle = obj.style.fontStyle;
                }
                if (obj.style.fontWeight) {
                    _span.style.fontWeight = obj.style.fontWeight;
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

    var setStyleToObjChar = function (obj, style) {
        if (typeof (style) === 'object') {
            $.extend(obj.style, style);
        } else if (typeof (style) === 'string') {
            if (style === 'italic') {
                obj.style.fontStyle = obj.style.fontStyle === 'italic' ? 'normal' : 'italic';
            } else if (style === 'bold') {
                obj.style.fontWeight = obj.style.fontWeight === 'bold' ? 'normal' : 'bold';
            }
        }
    };

    var setObjCharsStyle = function (start, end, style) {
        _.each(charObjects, function (obj, index) {
            if (index >= start && index <= end) {
                setStyleToObjChar(obj, style);
            }
        });
    };

    var splitChars = function (textarea) {
        var objects = [];
        var index = 0;

        var wrappedChars = $(textarea).find('span');

        if (wrappedChars.length == 0) {
            var obj = fillInCharObjects($(textarea).text(), index);
            $.merge(objects, obj);
            return objects;
        }

        $.each(wrappedChars, function (_, el) {
            if ($(el).text().length > 1) {
                var first = constructObjChar(el.textContent[0], index, el.style);
                objects.push(first);
                index += 1;
                var newObjects = fillInCharObjects(el.textContent.substring(1), index);
                index += newObjects.length;
                $.merge(objects, newObjects);
            } else {
                var obj = constructObjChar(el.textContent, index, el.style);
                objects.push(obj);
                index += 1;
            }
        });

        return objects;
    };

    $(document).ready(function () {

        var textarea = $('#textarea'),
            fontColorSelect = $('#font-color'),
            fontFamilySelect = $('#font-family'),
            italic = $('#italic'),
            bold = $('#bold');

        charObjects = fillInCharObjects(textarea.text(), 0);

        textarea.html(wrapCharsInSpans(charObjects));

        fontColorSelect.click(function () {
            if (isFontColorBoxOpened) {
                var color = setControlColor($(this));
                var indexes = getSelectedArea();
                if (indexes) {
                    setObjCharsStyle(indexes.start, indexes.end, {'color': color});
                    textarea.html(wrapCharsInSpans(charObjects));
                    removeSelection();
                }
            }
            isFontColorBoxOpened = !isFontColorBoxOpened;
        });

        fontColorSelect.blur(function () {
            if (isFontColorBoxOpened) {
                isFontColorBoxOpened = false;
            }
        });

        fontColorSelect.click();
        fontColorSelect.click();

        fontFamilySelect.click(function () {
            if (isFontFamilyBoxOpened) {
                var selected = $(this).find(':selected')[0];
                var font = fontMap[selected.value];
                var indexes = getSelectedArea();
                if (indexes) {
                    setObjCharsStyle(indexes.start, indexes.end, {'fontFamily': font});
                    textarea.html(wrapCharsInSpans(charObjects));
                }
            }
            isFontFamilyBoxOpened = !isFontFamilyBoxOpened;
        });

        fontFamilySelect.blur(function () {
            if (isFontColorBoxOpened) {
                isFontColorBoxOpened = false;
            }
        });

        textarea.keyup(function () {
            charObjects = splitChars(textarea);
            textarea.html(wrapCharsInSpans(charObjects));
            setEndOfContenteditable(document.getElementById('textarea'));
        });

        italic.click(function () {
            var indexes = getSelectedArea();
            setObjCharsStyle(indexes.start, indexes.end, 'italic');
            textarea.html(wrapCharsInSpans(charObjects));
            removeSelection();
        });

        bold.click(function () {
            var indexes = getSelectedArea();
            setObjCharsStyle(indexes.start, indexes.end, 'bold');
            textarea.html(wrapCharsInSpans(charObjects));
            removeSelection();
        });

    });
})();



