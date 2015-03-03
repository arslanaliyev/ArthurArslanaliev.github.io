(function () {
    var sources = {
        google: {
            url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=8&q=http%3A%2F%2Fnews.google.com%2Fnews%3Foutput%3Drss',
            dataType: 'jsonp',
            dataSelector: function (data) {
                return data['responseData']['feed']['entries'];
            },
            filter: function(feeds) {
                return feeds;
            },
            template: '<div class="feed">' +
                '<div>' +
                '<span class="title">%title%</span><span class="date">%publishedDate%</span>' +
                '</div>' +
                '<div><p class="snippet">%contentSnippet%</p><a href="%link%" target="_blank">more</a></div></div>'
        },
        yahoo: {
            url: 'http://pipes.yahooapis.com/pipes/pipe.run?_id=giWz8Vc33BG6rQEQo_NLYQ&_render=json',
            dataType: 'json',
            dataSelector: function (data) {
                return data['value']['items'];
            },
            filter: function (feeds) {
                return _.reject(feeds, function(feed) {
                    return feed['media:content'];
                });
            },
            template: '<div class="feed">' +
                '<div>' +
                '<span class="title">%title%</span><span class="date">%pubDate%</span>' +
                '</div>' +
                '<div><p class="snippet">%description%</p><a href="%link%" target="_blank">more</a></div></div>'
        }
    };

    var willGetSomeFeeds = function (ajaxOptions, feedsSelector) {
        var _d = $.Deferred();

        var conf = {
            success: function (data) {
                var feeds = feedsSelector(data);
                _d.resolve(feeds);
            },
            error: function (err) {
                _d.reject(err);
            }
        };

        $.ajax($.extend(conf, ajaxOptions));

        return _d.promise();
    };

    var fillInTemplate = function (template, object) {
        var filledTemplate = template;

        _.each(template.match(/%[^%]*%/g), function (match) {
            var key = match.replace(/%/g, '');
            var value = object[key];
            if (value) {
                filledTemplate = filledTemplate.replace(new RegExp(match, 'g'), value);
            } else {
                filledTemplate = filledTemplate.replace(new RegExp(match, 'g'), '');
            }
        });

        return filledTemplate;
    };

    var pushFeedsInto = function ($container, feeds, template) {
        var out = [];

        _.each(_.first(feeds, 8), function (entry) {
            console.log(entry);
            out.push(fillInTemplate(template, entry));
        });

        $container.empty().append(out.join(''));
    };

    var clickHandler = function () {
        var type = $(this).data('type'),
            source = sources[type];

        var ajaxOptions = {
            url: source.url,
            dataType: source.dataType
        };

        $.when(willGetSomeFeeds(ajaxOptions, source.dataSelector)).then(function (feeds) {
            var container = $('#feeds');
            pushFeedsInto(container, source.filter(feeds), sources[type].template);
        });
    };

    $(document).ready(function () {

        $('#left-menu').find('li')
            .click(clickHandler)
            .first().click();
    });
})();