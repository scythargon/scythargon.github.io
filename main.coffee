myApp = angular.module('myApp', ['infinite-scroll'])

myApp.controller 'DemoController', ($scope, $timeout, $rootElement) ->
  $scope.$rootElement = $rootElement
  $scope.$timeout = $timeout
  $scope.posts = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
    {id: 6},
    {id: 7},
    {id: 8},
  ]
  $scope.loadMore = ->
    length = $scope.posts.length
    for i in [1..20]
      $scope.posts.push {id: i + length}
    return
  return