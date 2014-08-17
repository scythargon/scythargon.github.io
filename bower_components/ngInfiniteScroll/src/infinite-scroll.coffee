mod = angular.module('infinite-scroll', [])

mod.directive 'infiniteScroll', ['$rootScope', '$window', '$timeout', ($rootScope, $window, $timeout) ->
  restrict: 'A'
  scope:
      infiniteScrollObjects: '='
      infiniteScroll: '&'
      infiniteScrollVisibilityKey: '@'

  link: (scope, elem, attrs) ->
    $window = angular.element($window)

    # infinite-scroll-distance specifies how close to the bottom of the page
    # the window is allowed to be before we trigger a new scroll. The value
    # provided is multiplied by the window height; for example, to load
    # more when the bottom of the page is less than 3 window heights away,
    # specify a value of 3. Defaults to 0.
    scrollDistance = 0
    if attrs.infiniteScrollDistance?
      scope.$watch attrs.infiniteScrollDistance, (value) ->
        scrollDistance = parseInt(value, 10)

    # infinite-scroll-disabled specifies a boolean that will keep the
    # infnite scroll function from being called; this is useful for
    # debouncing or throttling the function call. If an infinite
    # scroll is triggered but this value evaluates to true, then
    # once it switches back to false the infinite scroll function
    # will be triggered again.
    scrollEnabled = true
    checkWhenEnabled = false
    if attrs.infiniteScrollDisabled?
      scope.$watch attrs.infiniteScrollDisabled, (value) ->
        scrollEnabled = !value
        if scrollEnabled && checkWhenEnabled
          checkWhenEnabled = false
          handler()

    init = ->
      for item in scope.infiniteScrollObjects
        item[scope.infiniteScrollVisibilityKey] = true

    TOP_SCROLL_RESERVE = 2000

    hide_topmost_items = ->
      for item in (scope.infiniteScrollObjects.filter (item, i) -> item[scope.infiniteScrollVisibilityKey] == true)
        elem = $ '#post_' + item.id
        if elem.position().top + elem.height() + TOP_SCROLL_RESERVE < window.pageYOffset
          item[scope.infiniteScrollVisibilityKey] = false
          window.scrollTo 0, window.pageYOffset - elem.height()
          console.log '#post_' + item.id + ' is hidden now'
      return

    show_topmost_items = ->
      for item in (scope.infiniteScrollObjects.filter (item, i) -> item[scope.infiniteScrollVisibilityKey] == false).reverse()
        if window.pageYOffset < TOP_SCROLL_RESERVE and item
          item[scope.infiniteScrollVisibilityKey] = true
          if not $rootScope.$$phase
            scope.$apply()
          elem = $ '#post_' + item.id
          window.scrollTo 0, window.pageYOffset + elem.height()
          console.log '#post_' + item.id + ' is visible now'
        else
          return


    handler = ->
      hide_topmost_items()
      show_topmost_items()
      if not $rootScope.$$phase
        scope.$apply()
      windowBottom = $window.height() + $window.scrollTop()
      elementBottom = elem.offset().top + elem.height()
      remaining = elementBottom - windowBottom
      shouldScroll = remaining <= $window.height() * scrollDistance

      if shouldScroll && scrollEnabled
        before = scope.infiniteScrollObjects.length
        scope.infiniteScroll()
        for item in (scope.infiniteScrollObjects.filter (item,i) -> i >= before)
          item[scope.infiniteScrollVisibilityKey] = true
        if not $rootScope.$$phase
          scope.$apply()
      else if shouldScroll
        checkWhenEnabled = true

    init()
    $window.on 'scroll', handler
    scope.$on '$destroy', ->
      $window.off 'scroll', handler

    $timeout (->
      if attrs.infiniteScrollImmediateCheck
        if scope.$eval(attrs.infiniteScrollImmediateCheck)
          handler()
      else
        handler()
    ), 0
]
