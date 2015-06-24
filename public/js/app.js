angular.module('demigs', ['ngRoute','ngSanitize','brSocialFeed','brSoundCloud','akoenig.deckgrid','wu.masonry'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'main.html',
    controller: 'HomeCtrl'
  })
  .when('/feed', {
    templateUrl: 'feed.html',
    controller: 'FeedCtrl'
  })
  .when('/albums', {
    templateUrl: 'albums.html',
    controller: 'AlbumsCtrl'
  })
  .when('/calendar', {
    templateUrl: 'calendar.html',
    controller: 'CalendarCtrl'
  })
  .when('/artwork', {
    templateUrl: 'artwork.html',
    controller: 'ArtworkCtrl'
  })
  .when('/story', {
    templateUrl: 'story.html',
    controller: 'StoryCtrl'
  });
  
  $locationProvider.html5Mode(true);
})

.factory('Page', function($location) {
  var title = '';
  var pageClass = '';
  var navActive = false;
  var playerActive = false;
  return {
    isActive: function(route) {
      return route === $location.path();
    },
    navActive: function() {
      return navActive;
    },
    playerActive: function() {
      return playerActive;
    },
    title: function() { 
      return 'The Demigs | ' + title;
    },
    pageTitle: function() {
      return title;
    },
    pageClass: function() {
      return pageClass;
    },
    setTitle: function(newTitle) {
      navActive = false;
      playerActive = false;
      title = newTitle;
    },
    setClass: function(newClass) {
      pageClass = newClass;
    },
    toggleNav: function() {
      navActive = !navActive;
      playerActive = false;
    },
    togglePlayer: function() {
      playerActive = !playerActive;
    }
  };
})

.constant('Artwork', [
    {
      file: 'cat.png',
      title: 'Welcome to Hard Times Cat Sketch by Jon Rudin'
    },
    {
      file: 'city.png',
      title: 'Welcome to Hard Times Collage by Chris Demiglio'
    },
    {
      file: 'clock-blue.png',
      title: 'Welcome to Hard Times Clock Sketch by Jon Rudin'
    },
    {
      file: 'fox-red.png',
      title: 'Welcome to Hard Times Fox Sketch by Jon Rudin'
    },
    {
      file: 'hand-yellow.png',
      title: 'Welcome to Hard Times Hand Sketch by Jon Rudin'
    },
    {
      file: 'pig-boy.png',
      title: 'Welcome to Hard Times Collage by Chris Demiglio'
    },
    {
      file: 'shop.png',
      title: 'Welcome to Hard Times Collage by Chris Demiglio'
    },
    {
      file: 'square-waves.png',
      title: 'Welcome to Hard Times Collage by Chris Demiglio'
    },
    {
      file: 'wtht-cover-no-words.png',
      title: 'Welcome to Hard Times Cover Collage by Chris Demiglio'
    }
  ]
)

.controller('PageCtrl', function($scope, Page, SC) {
  $scope.Page = Page;
  $scope.player = SC;
  $scope.$watch('player.volume', function(newVal) {
    $scope.player.setVolume(newVal);
  });
})

.controller('HomeCtrl', function($scope, Page, SocialFeed) {
  Page.setTitle('Latest');
  Page.setClass('deviler');
})

.controller('FeedCtrl', function($scope, Page, SocialFeed, $filter) {
  Page.setTitle('Feed');
  Page.setClass('fox');

  SocialFeed.load().then(null, null, function(data) {
    data = $filter('orderBy')(data, '-dt_create');
    $scope.feed = data;
  });
  
})

.controller('AlbumsCtrl', function($scope, Page, SocialFeed) {
  Page.setTitle('Albums');
  Page.setClass('icarus');
})

.controller('CalendarCtrl', function($scope, Page) {
  Page.setTitle('Calendar');
  Page.setClass('clock');
})

.controller('ArtworkCtrl', function($scope, Page, Artwork) {
  Page.setTitle('Artwork');
  Page.setClass('cat');
  $scope.artwork = Artwork;
})

.controller('StoryCtrl', function($scope, Page) {
  Page.setTitle('Story');
  Page.setClass('boy-toy');
})

.directive('brFancybox', function() {
  return {
    link: function($scope, $element) {
      $($element).fancybox({
        openEffect: 'fade',
        closeEffect: 'elastic',
        openSpeed: 'fast',
        tpl: {
          closeBtn : '<a title="Close" class="fa fa-times-circle fa-3x br-fancybox-close" href="javascript:;"></a>',
        },

        helpers: {
          title: {
            type: 'inside'
          }
        }
      });
    }
  }
})

.directive('scPlayer', function($window, $timeout) {
  return {
    controller: function($scope, $element) {
      $scope.checkPlayerY = function() {
        var playerY = $element[0].getBoundingClientRect().top;
        var navY = $element[0].previousElementSibling.getBoundingClientRect().bottom;
        if (playerY < (navY)) {
          $element.addClass('playerhide');
        } else if ($element.hasClass('playerhide')) {
          $element.removeClass('playerhide');
        }
      }
    },
    link: function preLink($scope, $element) {
      angular.element($window).bind('load', function() {
        $timeout(function() {
          $scope.checkPlayerY();
        }, 100);
      });
      angular.element($window).bind('resize', function() {
        $scope.checkPlayerY();
      });
    }
  };
})

.directive('scPlayerKnob', function($window) {
  return {
    require: 'ngModel',
    controller: function($scope, $element) {
      $scope.resize = function() {
        var width = $('.playpause').width() + 10;
        $($element[0]).prev().width(width).height(width);
      }
    },
    link: function($scope, $element, $attrs, $ngModel) {
      $($element).knob({
        change: function(v) {
          $ngModel.$setViewValue(Math.floor(v));
        },
        release: function (v) {
          $ngModel.$setViewValue(v);
        }
      });
      $($element).val(100).trigger('change');
      angular.element($window).bind('load', function() {
        $scope.resize();
      });
      angular.element($window).bind('resize', function() {
        $scope.resize();
      });
    }
  };
})

;