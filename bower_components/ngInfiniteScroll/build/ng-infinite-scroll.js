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
        var checkWhenEnabled, handler, hide_topmost_items, init, scrollDistance, scrollEnabled;
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
        init = function() {
          var item, _i, _len, _ref, _results;
          _ref = scope.infiniteScrollObjects;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            _results.push(item[scope.infiniteScrollVisibilityKey] = true);
          }
          return _results;
        };
        hide_topmost_items = function() {
          var item, _i, _len, _ref;
          _ref = scope.infiniteScrollObjects.filter(function(item, i) {
            return item[scope.infiniteScrollVisibilityKey] === true;
          });
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            elem = $('#post_' + item.id);
            if (elem.position().top + elem.height() + 500 < window.pageYOffset) {
              item[scope.infiniteScrollVisibilityKey] = false;
              window.scrollTo(0, window.pageYOffset - elem.height());
              console.log('#post_' + item.id + ' is hidden now');
            }
          }
        };
        handler = function() {
          var before, elementBottom, item, remaining, shouldScroll, windowBottom, _i, _len, _ref;
          hide_topmost_items();
          if (!$rootScope.$$phase) {
            scope.$apply();
          }
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            before = scope.infiniteScrollObjects.length;
            scope.infiniteScroll();
            _ref = scope.infiniteScrollObjects.filter(function(item, i) {
              return i >= before;
            });
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              item[scope.infiniteScrollVisibilityKey] = true;
            }
            if (!$rootScope.$$phase) {
              return scope.$apply();
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        init();
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
