/* ng-infinite-scroll - v1.0.0 - 2014-08-19 */
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
        var BOTTOM_SCROLL_RESERVE, TOP_SCROLL_RESERVE, checkWhenEnabled, check_bottom_items, check_topmost_items, debug, handler, init, scrollDistance, scrollEnabled, self_check, shouldScroll, show_bottom_items, show_topmost_items;
        $window = angular.element($window);
        scope.parent_elem = elem;
        debug = false;
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
          var item, _i, _len, _ref;
          _ref = scope.infiniteScrollObjects;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            item[scope.infiniteScrollVisibilityKey] = true;
          }
          scope.first_visible_idx = 0;
          return scope.last_visible_idx = scope.infiniteScrollObjects.length - 1;
        };
        TOP_SCROLL_RESERVE = 2000;
        BOTTOM_SCROLL_RESERVE = 5000;
        check_topmost_items = function() {
          var hidden, item, _i, _len, _ref;
          hidden = false;
          if (TOP_SCROLL_RESERVE < window.pageYOffset) {
            _ref = scope.infiniteScrollObjects.slice(scope.first_visible_idx);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              elem = $('#post_' + item.id);
              if (elem.size() && elem.position().top + elem.outerHeight(true) + TOP_SCROLL_RESERVE < window.pageYOffset) {
                item[scope.infiniteScrollVisibilityKey] = false;
                hidden=true;
                scope.first_visible_idx += 1;
                window.scrollTo(0, window.pageYOffset - elem.outerHeight(true));
                if (debug) {
                  console.log('%c hide_topmost_items: #post_' + item.id + ' is hidden now', 'color: green;');
                }
              } else {
                break;
              }
            }
          }
          if (!hidden) {
            return show_topmost_items();
          }
        };
        show_topmost_items = function() {
          var item, _i, _len, _ref;
          if (window.pageYOffset > TOP_SCROLL_RESERVE) {
            return;
          }
          _ref = scope.infiniteScrollObjects.slice(0, scope.first_visible_idx).reverse();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (window.pageYOffset < TOP_SCROLL_RESERVE && item) {
              item[scope.infiniteScrollVisibilityKey] = true;
              scope.first_visible_idx -= 1;
              if (!$rootScope.$$phase) {
                scope.$apply();
              }
              elem = $('#post_' + item.id);
              window.scrollTo(0, window.pageYOffset + elem.outerHeight(true));
              if (debug) {
                console.log('%c show_topmost_items: #post_' + item.id + ' is visible now', 'color:lime');
              }
            } else {
              return;
            }
          }
        };
        check_bottom_items = function() {
          var hidden, item, _i, _len, _ref;
          hidden = false;
          _ref = scope.infiniteScrollObjects.slice(0, scope.last_visible_idx + 1).reverse();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            elem = $('#post_' + item.id);
            if (elem.size() && elem.position().top > window.pageYOffset + BOTTOM_SCROLL_RESERVE) {
              item[scope.infiniteScrollVisibilityKey] = false;
              hidden =  true;
              scope.last_visible_idx -= 1;
              if (debug) {
                console.log('%c check_bottom_items: #post_' + item.id + ' is hidden now', 'color: blue;');
              }
            } else {
              break;
            }
          }
          if (!hidden) {
            return show_bottom_items();
          }
        };
        show_bottom_items = function() {
          var is_lowest_too_low, item, _i, _len, _ref;
          if (scope.last_visible_idx === scope.infiniteScrollObjects.length - 1) {
            return;
          }
          is_lowest_too_low = function() {
            var lowest, lowest_item;
            lowest_item = scope.infiniteScrollObjects[scope.last_visible_idx];
            lowest = $('#post_' + lowest_item.id);
            return lowest.position().top < window.pageYOffset + BOTTOM_SCROLL_RESERVE;
          };
          if (!shouldScroll()) {
            return;
          }
          _ref = scope.infiniteScrollObjects.slice(scope.last_visible_idx + 1);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            item[scope.infiniteScrollVisibilityKey] = true;
            scope.last_visible_idx += 1;
            if (!$rootScope.$$phase) {
              scope.$apply();
            }
            if (debug) {
              console.log('%c show_bottom_items: #post_' + item.id + ' is visible now', 'color: #00ffff');
            }
            if (!shouldScroll()) {
              return;
            }
          }
        };
        shouldScroll = function() {
          var elementBottom, remaining, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = scope.parent_elem.offset().top + scope.parent_elem.height();
          remaining = elementBottom - windowBottom;
          return remaining <= $window.height() * scrollDistance;
        };
        self_check = function() {
          var cur, post, prev, _i, _len, _ref;
          prev = parseInt($('.post:eq(0)').text());
          _ref = $('.post').slice(1);
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            cur = parseInt($(post).text());
            if (cur !== prev + 1) {
              console.log('%c ALARM ALARM ALARM', 'color: red; font-weight: bold;');
              alert('max attention');
              throw new Error;
            }
            prev = cur;
          }
          if (debug) {
            return console.log('%c ________OK', 'color: green; font-weight: bold;');
          }
        };
        scope.previos_yposition = 0;
        handler = function() {
          var before, distance, item, _i, _len, _ref;
          if (debug) {
            distance = Math.abs(window.pageYOffset - scope.previos_yposition);
            if (window.pageYOffset > scope.previos_yposition) {
              console.log('%c DOWN ' + distance, 'color: red; font-weight: bold;');
            } else {
              console.log('%c UP ' + distance, 'color: red; font-weight: bold;');
            }
            scope.previos_yposition = window.pageYOffset;
          }
          check_topmost_items();
          check_bottom_items();
          if (!$rootScope.$$phase) {
            scope.$apply();
          }
          if (scope.last_visible_idx === scope.infiniteScrollObjects.length - 1 && shouldScroll() && scrollEnabled) {
            before = scope.infiniteScrollObjects.length;
            scope.infiniteScroll();
            _ref = scope.infiniteScrollObjects.filter(function(item, i) {
              return i >= before;
            });
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              item[scope.infiniteScrollVisibilityKey] = true;
            }
            scope.last_visible_idx = scope.infiniteScrollObjects.length - 1;
            if (debug) {
              console.log('%c new objects loaded, latest: ' + scope.infiniteScrollObjects.length, 'color: blue; font-weight: bold;');
            }
            if (!$rootScope.$$phase) {
              scope.$apply();
            }
          } else if (shouldScroll()) {
            checkWhenEnabled = true;
          }
          return self_check();
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
