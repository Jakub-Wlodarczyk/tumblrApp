'use strict';

angular.module('welcome.page', ['ngRoute'])
    
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/welcome', {
        templateUrl: 'components/welcomeView/welcome.html',
        controller: 'WelcomePageCtrl',
        controllerAs: 'welcome'
    });
}])
    
.factory('randomUsers', [function() {
    return ['cat', 'dogshaming', 'barcelona', 'angular-js', 'programminghumor' ];
}])
    
.controller('WelcomePageCtrl', ['$rootScope', '$window', '$scope', 'randomUsers', function($rootScope, $window, $scope, randomUsers) {
    var self = this;
    
    self.setInitialState = function() {
        self.posts = [];
        self.currentUser = '';
        self.totalPosts = '';
        self.numberOfIterationCalls = 0;
        self.loadNextPosts = 50;
        self.postsCounter = [];
        self.joinedPosts = [];
        self.firstPosts = [];
        self.allPostsLoaded = false;
        self.hideSearchArea = false;
        self.tumblrRandomUser = '';
        self.isNewSearch = false;
        self.isAllPosts = false;
        self.isPostsLoading = false;
        self.isInitialState = true;
        self.showAllPosts = false;
        $scope.tumblrUser = '';
    }
    
    self.setInitialState();
    
    /* load posts and add new ones when number exceeds the default limit (50) */
    self.getScript = function(user, callback) {
        self.isNewSearch = false;
        self.isPostsLoading = true;
        self.hideSearchArea = true;
        self.currentUser = user;
        
        if(self.posts.length > 0) {
            self.totalPosts = self.postsCounter[0]['posts-total'];
            self.numberOfIterationCalls = Math.ceil(self.totalPosts / 50);
        }
        
        var s = document.createElement('script');
        if($scope.tumblrUser !== '') {
            if(self.posts.length > 0) {
                s.src = 'http://' + user + '.tumblr.com/api/read/json?num=50&start=' + self.loadNextPosts;
                self.loadNextPosts += 50;
            } else {
                s.src = 'http://' + user + '.tumblr.com/api/read/json?num=50';
            }
        }
        s.id = 'delete';
        s.async = true;
        s.onreadystatechange = s.onload = function() {
                callback.done = true;
                if(self.numberOfIterationCalls > 0) {
                    if(self.posts.length < self.numberOfIterationCalls) {
                        callback();
                        self.joinedPosts = self.posts.concat.apply([], self.posts);
                        $scope.$apply(function() {
                            self.totalPosts = self.totalPosts;
                            self.joinedPosts = self.joinedPosts;
                        });
                    } else {
                        $scope.$apply(function() {
                            self.allPostsLoaded = true;
                        });
                        return;
                    }
                } else {
                    callback();
                }
        };
        document.querySelector('head').appendChild(s);
    };
    
    self.logResult = function() {
        if(self.postsCounter.length <= 1) {
            self.postsCounter.push(tumblr_api_read);
        }
        self.posts.push(tumblr_api_read.posts);
        if(self.firstPosts.length === 0) {
            
            self.firstPosts.push(tumblr_api_read.posts);
            self.firstPosts = self.firstPosts.concat.apply([], self.firstPosts);
            $scope.$apply(function() {
                self.firstPosts;
            });
        }
        
        var currentScript = document.getElementById('delete');
        document.getElementsByTagName('head')[0].removeChild(currentScript);
        self.getScript(self.currentUser, self.logResult);
    };
    
    self.getRandomUser = function($event) {
        var objectState = $event.target.classList[1];
        
        if(typeof objectState === 'undefined') {
            self.newSearch();
        }
        
        if(self.isInitialState && self.isPostsLoading === false) {
            var users = randomUsers;
            $scope.tumblrUser = users[Math.floor(Math.random() * users.length)];
            document.getElementById('user-search-field').value = $scope.tumblrUser;
        }
    };
    
    self.allPosts = function() {
        self.isAllPosts = true;
    };
    
    self.displayAllPosts = function($event) {
        if(!self.allPostsLoaded || self.isNewSearch) {
            self.showAllPosts =  false;
        } else if(self.allPostsLoaded && self.numberOfIterationCalls > 1) {
            self.showAllPosts =  true;
        }
    };
    
    self.newSearch = function() {
        self.setInitialState();
        self.isNewSearch = true;
    }
}]);



