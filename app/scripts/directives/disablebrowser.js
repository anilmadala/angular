angular.module('ratefastApp').factory('location', [
    '$location',
    '$route',
    '$rootScope',
    function ($location, $route, $rootScope) {
        var page_route = $route.current;

        $location.skipReload = function () {
            //var lastRoute = $route.current;
            var unbind = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = page_route;
                unbind();
            });
            return $location;
        };

        if ($location.intercept) {
            throw '$location.intercept is already defined';
        }

        $location.intercept = function (url_pattern, load_url) {

            function parse_path() {
                var match = $location.path().match(url_pattern)
                if (match) {
                    match.shift();
                    return match;
                }
            }

            var unbind = $rootScope.$on("$locationChangeSuccess", function () {
                var matched = parse_path();
                if (!matched || load_url(matched) === false) {
                    return unbind();
                }
                $route.current = page_route;
            });
        };

        return $location;
    }
]);