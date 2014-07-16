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
        $scope.first_visible_idx = 0;
        $scope.last_visible_idx = $scope.posts.length - 1;
    };

    $scope.is_visible = function(item) {
      return item.visible;
    };

    $scope.hide_topmost_items = function(){

        var TOP_SCROLL_RESERVE = 2000;
        var BOTTOM_SCROLL_RESERVE = 5000;

        var changed = false;

        function StopCheckingException() {};

        try {  // hiding the topmost when scrolling down
            _.each($scope.posts.slice($scope.first_visible_idx), function(post){
                var elem = $('#post_' + post.id);

                if (elem.position().top + elem.height() + TOP_SCROLL_RESERVE < window.pageYOffset){
                    changed = true;
                    $scope.first_visible_idx += 1;
                    post.visible = false;
                    window.scrollTo(0, window.pageYOffset - elem.height());
                    //$(window).height()
                    console.log(post.id + ' is hidden now');
                } else {
                    throw new StopCheckingException();  // need to return from _.each call
                }
            });
        } catch (e) {
            if (e instanceof StopCheckingException) {
                // everything is OK
            }
            else {
                throw e;
            }
        }


        try {  // showing back the topmost when scrolling up
            _.each($scope.posts.slice(0, $scope.first_visible_idx).reverse(), function(post){
                if (window.pageYOffset < TOP_SCROLL_RESERVE){
                    changed = true;
                    $scope.first_visible_idx -= 1;
                    post.visible = true;
                    $scope.$apply();
                    var elem = $('#post_' + post.id);
                    window.scrollTo(0, window.pageYOffset + elem.height());
                    console.log(post.id + ' is visible now');
                } else {
                    throw new StopCheckingException();  // need to return from _.each call
                }
            });
        } catch (e) {
            if (e instanceof StopCheckingException) {
                // everything is OK
            }
            else {
                throw e;
            }
        }


        try {  // hiding the lowest when scrolling up
            _.each($scope.posts.slice(0, $scope.last_visible_idx + 1).reverse(), function(post){
                var elem = $('#post_' + post.id);

                if (elem.position().top > window.pageYOffset + BOTTOM_SCROLL_RESERVE){
                    changed = true;
                    $scope.last_visible_idx -= 1;
                    post.visible = false;
                    //window.scrollTo(0, window.pageYOffset - elem.height());
                    //$(window).height()
                    console.log(post.id + ' is hidden now');
                } else {
                    throw new StopCheckingException();  // need to return from _.each call
                }
            });
        } catch (e) {
            if (e instanceof StopCheckingException) {
                // everything is OK
            }
            else {
                throw e;
            }
        }


        if (changed)
            $scope.$apply();

    };

    $(window).on('scroll', $scope.hide_topmost_items);

    $scope.loadMore = function() {
        var length = $scope.posts.length;
        var last = $scope.posts[length - 1];
        for(var i = 1; i <= 8; i++) {
            $scope.posts.push({id: i + length, visible: true});
        }
        $scope.last_visible_idx = $scope.posts.length - 1;
    };

    $scope.init();
});
