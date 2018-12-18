var DownloadDirective, app, buildDirectiveFactory,
  __bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
  __slice = [].slice;

DownloadDirective = (function () {
    DownloadDirective.$inject = ['$window'];
    function DownloadDirective(window) {
        this.setupDataDownload = __bind(this.setupDataDownload, this);
        this.setupUrlDownload = __bind(this.setupUrlDownload, this);
        this.link = __bind(this.link, this);
        this.URL = window.webkitURL || window.URL;
        this.Blob = window.Blob;
    }

    DownloadDirective.prototype.restrict = 'A';

    DownloadDirective.prototype.link = function (scope, element, attrs) {
        var a, attr, attrNames, updateDom, watchers, _i, _len, _results;
        a = element[0];
        debugger;
            element.bind("dragstart", function (event) {
                return event.originalEvent.dataTransfer.setData("DownloadURL", a.dataset.downloadurl);
            });
        a.href = '#';
        element.click(function () {
            if (a.href === '#') {
                return false;
            }
        });
        attrNames = ['ngDownload', 'mimeType', 'url', 'content'];
        updateDom = (function (_this) {            
            return function () {
                var attr, content, filename, mimeType, url, _ref;
                _ref = (function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = attrNames.length; _i < _len; _i++) {
                        attr = attrNames[_i];
                        _results.push(scope.$eval(attrs[attr]));
                    }
                    debugger;
                    return _results;
                })(), filename = _ref[0], mimeType = _ref[1], url = _ref[2], content = _ref[3];
                filename || (filename = 'file');
                mimeType || (mimeType = 'application/doc');
                if (url != null) {
                    return _this.setupUrlDownload(a, url, filename, mimeType);
                } else if (content != null) {
                    return _this.setupDataDownload(a, content, filename, mimeType);
                }
            };
        })(this);
        watchers = {};
        _results = [];
        for (_i = 0, _len = attrNames.length; _i < _len; _i++) {
            attr = attrNames[_i];
            _results.push((function (attr) {
                return attrs.$observe(attr, function (attrValue) {
                    if (watchers[attr] != null) {
                        watchers[attr]();
                    }
                    if (attrValue) {
                        return watchers[attr] = scope.$watch(attrValue, updateDom);
                    }
                });
            })(attr));
        }
        return _results;
    };

    DownloadDirective.prototype.setupUrlDownload = function (a, url, filename, mimeType) {
        if (a.href !== '#') {
            this.URL.revokeObjectURL(a.href);
        }
        a.download = filename;
        a.href = url;
        return a.dataset.downloadurl = [mimeType, a.download, a.href].join(":");
    };

    DownloadDirective.prototype.setupDataDownload = function (a, data, filename, mimeType) {
        var blob, url;
        blob = new this.Blob([data], {
            type: mimeType
        });
        url = this.URL.createObjectURL(blob);
        return this.setupUrlDownload(a, url, filename, mimeType);
    };

    return DownloadDirective;

})();

buildDirectiveFactory = function (ctor) {
    var factory;
    factory = function () {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (function (func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
        })(ctor, args, function () { });
    };
    factory.$inject = ctor.$inject;
    return factory;
};

angular.module('ratefastApp')
.directive('ngDownload', buildDirectiveFactory(DownloadDirective))
.directive('compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
          function (scope) {
              return scope.$eval(attrs.compile);
          },
          function (value) {
              var result = element.html(value);
              debugger;
              $compile(element.contents())(scope.$parent.$parent);
          }
        );
    };
});