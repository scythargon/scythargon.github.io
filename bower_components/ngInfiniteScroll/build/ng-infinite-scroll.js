/* ng-infinite-scroll - v1.0.0 - 2014-08-17 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      restrict: 'A',
      scope: {
        infiniteScrollObjects: '=',
        infiniteScroll: '&',
        infiniteScrollVisibilityKey: '@'
      },
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, hide_topmost_items, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        hide_topmost_items = function() {
          var item, _i, _len, _ref;
          _ref = scope.infiniteScrollObjects;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            elem = $('#post_' + item.id);
            if (elem.position().top + elem.height() + 500 < window.pageYOffset) {
              elem.hidden = true;
              window.scrollTo(0, window.pageYOffset - elem.height());
              elem.hide();
              console.log('#post_' + item.id + ' is hidden now');
            }
          }
        };
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          hide_topmost_items();
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.infiniteScroll();
            } else {
              scope.infiniteScroll();
              return scope.$apply();
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);
