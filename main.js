var myApp = angular.module('myApp', ['infinite-scroll']);

myApp.controller('DemoController', function($scope, $timeout, $rootElement) {
    $scope.$rootElement = $rootElement;
    $scope.$timeout= $timeout;

    $scope.init = function(){
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

        window.posts = $scope.posts;
        _.each($scope.posts, function(post){
            post.visible = true;
        });
        //$scope.posts[1].visible = false;
    };

    $scope.is_visible = function(item) {
      return item.visible;
    };

    $scope.hide_topmost_items = function(){
        _.each($scope.posts, function(post){
            var elem = $('#post_' + post.id);
            if (elem.position().top + elem.height() + 500 < window.pageYOffset){
                post.visible = false;
                window.scrollTo(0, window.pageYOffset - elem.height());
                //elem.hide();
                console.log('#post_' + post.id + ' is hidden now')
            }
        });
    };

    $(window).on('scroll', $scope.hide_topmost_items);

    $scope.loadMore = function() {
        var length = $scope.posts.length;
        var last = $scope.posts[length - 1];
        for(var i = 1; i <= 8; i++) {
            $scope.posts.push({id: i + length});
        }
    };

    $scope.init();
});
