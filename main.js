var myApp = angular.module('myApp', ['infinite-scroll']);
myApp.controller('DemoController', function($scope, $timeout, $rootElement) {
  $scope.$rootElement = $rootElement;
  $scope.$timeout= $timeout;
  $scope.posts = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4},
      {id: 5},
      {id: 6},
      {id: 7},
      {id: 8},
  ];

  $scope.loadMore = function() {
    var last = $scope.posts[$scope.posts.length - 1];
    for(var i = 1; i <= 8; i++) {
      $scope.posts.push({id: i});
    }
  };
});

