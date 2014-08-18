mod = angular.module('infinite-scroll', [])

mod.directive 'infiniteScroll', ['$rootScope', '$window', '$timeout', ($rootScope, $window, $timeout) ->
  restrict: 'A'
  scope:
      infiniteScrollObjects: '='
      infiniteScroll: '&'
      infiniteScrollVisibilityKey: '@'

  link: (scope, elem, attrs) ->
    $window = angular.element($window)
    scope.parent_elem = elem
    debug = false

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
      scope.first_visible_idx = 0
      scope.last_visible_idx = scope.infiniteScrollObjects.length - 1

    TOP_SCROLL_RESERVE = 2000
    BOTTOM_SCROLL_RESERVE = 5000

    check_topmost_items = ->
      hidden = false
      if TOP_SCROLL_RESERVE < window.pageYOffset
        for item in scope.infiniteScrollObjects.slice(scope.first_visible_idx)
          elem = $ '#post_' + item.id
          if elem.size() and elem.position().top + elem.outerHeight(true) + TOP_SCROLL_RESERVE < window.pageYOffset
            item[scope.infiniteScrollVisibilityKey] = false
            `hidden=true`
            scope.first_visible_idx += 1
            window.scrollTo 0, window.pageYOffset - elem.outerHeight(true)
            if debug
              console.log('%c hide_topmost_items: #post_' + item.id + ' is hidden now', 'color: green;')
          else
            break
      if not hidden
        show_topmost_items()

    show_topmost_items = ->
      if window.pageYOffset > TOP_SCROLL_RESERVE
        return
      for item in scope.infiniteScrollObjects.slice(0, scope.first_visible_idx).reverse()
        if window.pageYOffset < TOP_SCROLL_RESERVE and item
          item[scope.infiniteScrollVisibilityKey] = true
          scope.first_visible_idx -= 1
          if not $rootScope.$$phase
            scope.$apply()
          elem = $ '#post_' + item.id
          window.scrollTo 0, window.pageYOffset + elem.outerHeight(true)
          if debug
            console.log('%c show_topmost_items: #post_' + item.id + ' is visible now', 'color:lime')
        else
          return

    check_bottom_items = ->
      hidden = false
      for item in scope.infiniteScrollObjects.slice(0, scope.last_visible_idx + 1).reverse()
        elem = $ '#post_' + item.id
        if elem.size() and elem.position().top > window.pageYOffset + BOTTOM_SCROLL_RESERVE
          item[scope.infiniteScrollVisibilityKey] = false
          `hidden =  true`
          scope.last_visible_idx -= 1
          if debug
            console.log('%c check_bottom_items: #post_' + item.id + ' is hidden now', 'color: blue;')
        else
          break
      if not hidden
        show_bottom_items()

    show_bottom_items = ->
      if scope.last_visible_idx == scope.infiniteScrollObjects.length - 1
        return
      is_lowest_too_low = ->
        lowest_item = scope.infiniteScrollObjects[scope.last_visible_idx]
        lowest = $ '#post_' + lowest_item.id
        return lowest.position().top < window.pageYOffset + BOTTOM_SCROLL_RESERVE
      if not shouldScroll()
        return

      for item in scope.infiniteScrollObjects.slice(scope.last_visible_idx + 1)
        item[scope.infiniteScrollVisibilityKey] = true
        scope.last_visible_idx += 1
        if not $rootScope.$$phase
          scope.$apply()
        if debug
          console.log('%c show_bottom_items: #post_' + item.id + ' is visible now', 'color: #00ffff')
        if not shouldScroll()
          return

    shouldScroll = ->
      windowBottom = $window.height() + $window.scrollTop()
      elementBottom = scope.parent_elem.offset().top + scope.parent_elem.height()
      remaining = elementBottom - windowBottom
      return remaining <= $window.height() * scrollDistance

    self_check = ->
      prev = parseInt $('.post:eq(0)').text()
      for post in $('.post').slice(1)
        cur = parseInt $(post).text()
        if cur != prev + 1
          console.log('%c ALARM ALARM ALARM', 'color: red; font-weight: bold;')
          alert 'max attention'
          throw new Error
        prev = cur
      if debug
        console.log('%c ________OK', 'color: green; font-weight: bold;')


    scope.previos_yposition = 0

    handler = ->
      if debug
        distance = Math.abs(window.pageYOffset - scope.previos_yposition)
        if window.pageYOffset > scope.previos_yposition
          console.log('%c DOWN ' + distance, 'color: red; font-weight: bold;')
        else
          console.log('%c UP ' + distance, 'color: red; font-weight: bold;')
        scope.previos_yposition = window.pageYOffset
      check_topmost_items()
      check_bottom_items()
      if not $rootScope.$$phase
        scope.$apply()
      if scope.last_visible_idx == scope.infiniteScrollObjects.length - 1 and shouldScroll() and scrollEnabled
        before = scope.infiniteScrollObjects.length
        scope.infiniteScroll()
        for item in (scope.infiniteScrollObjects.filter (item,i) -> i >= before)
          item[scope.infiniteScrollVisibilityKey] = true
        scope.last_visible_idx = scope.infiniteScrollObjects.length - 1
        if debug
          console.log('%c new objects loaded, latest: '+scope.infiniteScrollObjects.length, 'color: blue; font-weight: bold;')
        if not $rootScope.$$phase
          scope.$apply()
      else if shouldScroll()
        checkWhenEnabled = true
      self_check()

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
