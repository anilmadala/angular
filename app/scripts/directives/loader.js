angular.module('ratefastApp')
.directive('gtLoader', function ($compile) {
    return {
        restrict: 'EAC',
        link: function ($scope, $element, $attr) {
            var template;
            var type = $attr.type;

            switch (type) {
                case 'overlay':
                    template = '<div id="overlayContainer" class="overlayContainer spinner">' +
                    '<div class="overlayBackground"></div>' +
                        '<div class="overlayContent">' +
                            '<br />' +
                            '<img src="/images/spinner.gif"><span>&nbsp;&nbsp;Loading</span>' +
                        '</div>' +
                    '</div>'
                    break;
                case 'center':
                    template = '<div id="overlayContainerCenter" class="overlayContainerCenter  spinner">' +
                         '<img src="/images/spinner.gif"><span>&nbsp;&nbsp;Loading</span>' +
                    '</div>'
                    break;
                case 'inline':
                    template = '<div id="overlayContainerInline" class="overlayContainerInline  spinner">' +
                            '<img src="/images/spinner.gif">' +
                        '</div>'
                    break;
            }
            $element.html(template);
            $compile($element.contents())($scope);
        }
    };
});