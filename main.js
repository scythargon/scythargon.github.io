var myApp = angular.module('myApp', ['infinite-scroll']);
myApp.controller('DemoController', function($scope, $timeout, $rootElement) {
    $scope.$rootElement = $rootElement;
    $scope.$timeout= $timeout;
    $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];

    $scope.loadMore = function() {
        var last = $scope.images[$scope.images.length - 1];
        for(var i = 1; i <= 8; i++) {
            $scope.images.push(last + i);
        }
        $scope.$timeout(function(){
            $scope.$rootElement.find('[infinite-scroll]').trigger('scroll-check');
        });
    };
});

