var myApp;

myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope, $timeout, $rootElement) {
  $scope.$rootElement = $rootElement;
  $scope.$timeout = $timeout;
  $scope.posts = [
    {
      id: 1
    }, {
      id: 2
    }, {
      id: 3
    }, {
      id: 4
    }, {
      id: 5
    }, {
      id: 6
    }, {
      id: 7
    }, {
      id: 8
    }
  ];
  $scope.loadMore = function() {
    var i, length, _i;
    length = $scope.posts.length;
    for (i = _i = 1; _i <= 20; i = ++_i) {
      $scope.posts.push({
        id: i + length
      });
    }
  };
});
