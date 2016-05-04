angular.module('demigs', ['ngMaterial','ngTouch','ngRoute','ngSanitize','brSocialFeed','brSoundCloud','akoenig.deckgrid','wu.masonry','templates'])

.config(['$routeProvider', '$locationProvider'], function($routeProvider, $locationProvider) {
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

.factory('Page', ['$location', '$mdSidenav', '$anchorScroll', 'SC', '$timeout'], function($location, $mdSidenav, $anchorScroll, SC, $timeout) {
  var title = '';
  var pageClass = '';
  return {
    isActive: function(route) {
      return route === $location.path();
    },
    navOpen: function() {
      return $mdSidenav('left').isOpen();
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
      $anchorScroll('top');
      $mdSidenav('left').close();
      title = newTitle;
    },
    setClass: function(newClass) {
      pageClass = newClass;
    },
    toggleNav: function() {
      $mdSidenav('left').toggle();
      if (SC.isPlaying()) {
        $timeout(function() {
          $anchorScroll('player');
        }, 200);
      }
    },
    hideNav: function() {
      $mdSidenav('left').close();
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
    },
    {
      file: 'wtht-promo-blur.png',
      title: 'Welcome to Hard Times Promo Photo by Tesa Morin'
    },
    {
      file: 'wtht-promo-squares.png',
      title: 'Welcome to Hard Times Promo Photo by Tesa Morin'
    },
    {
      file: 'wtht-promo.png',
      title: 'Welcome to Hard Times Promo Material by Tesa Morin'
    },
    {
      file: 'wtht-release-poster.png',
      title: 'Welcome to Hard Times Release Poster'
    },
    {
      file: 'cities-cover.png',
      title: 'Cities Can Wait Album Cover'
    },
    {
      file: 'citiesbook1.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook2.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook3.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook4.png',
      title: 'Cities Can Wait Artwork by Jon Demiglio'
    },
    {
      file: 'citiesbook5.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook6.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook7.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook8.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook9.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook10.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook11.png',
      title: 'Cities Can Wait Artwork'
    },
    {
      file: 'citiesbook12.png',
      title: 'Cities Can Wait Artwork'
    }
  ]
)

.controller('PageCtrl', ['$scope', 'Page', 'SC', '$mdMedia'], function($scope, Page, SC, $mdMedia) {
  $scope.$medMedia = $mdMedia;
  $scope.Page = Page;
  $scope.player = SC;
  $scope.$watch('player.volume', function(newVal) {
    $scope.player.setVolume(newVal);
  });
})

.controller('HomeCtrl', ['$scope', 'Page', 'SocialFeed'], function($scope, Page, SocialFeed) {
  Page.setTitle('Latest');
  Page.setClass('deviler');
})

.controller('FeedCtrl', ['$scope', 'Page', 'SocialFeed', '$filter'], function($scope, Page, SocialFeed, $filter) {
  Page.setTitle('Feed');
  Page.setClass('fox');

  SocialFeed.load().then(null, null, function(data) {
    data = $filter('orderBy')(data, '-dt_create');
    $scope.feed = data;
  });

})

.controller('AlbumsCtrl', ['$scope', 'Page', 'SocialFeed', 'SC'], function($scope, Page, SocialFeed, SC) {
  Page.setTitle('Albums');
  Page.setClass('icarus');
  $scope.Player = SC;
})

.controller('CalendarCtrl', ['$scope', 'Page'], function($scope, Page) {
  Page.setTitle('Calendar');
  Page.setClass('clock');
})

.controller('ArtworkCtrl', ['$scope', 'Page', 'Artwork'], function($scope, Page, Artwork) {
  Page.setTitle('Artwork');
  Page.setClass('cat');
  $scope.artwork = Artwork;
})

.controller('StoryCtrl', ['$scope', 'Page'], function($scope, Page) {
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

// .directive('scPlayer', function($window, $timeout) {
//   return {
//     controller: function($scope, $element) {
//       $scope.checkPlayerY = function() {
//         var playerY = $element[0].getBoundingClientRect().top;
//         var navY = $element[0].previousElementSibling.getBoundingClientRect().bottom;
//         if (playerY < (navY)) {
//           $element.addClass('playerhide');
//         } else if ($element.hasClass('playerhide')) {
//           $element.removeClass('playerhide');
//         }
//       }
//     },
//     link: function preLink($scope, $element) {
//       angular.element($window).bind('load', function() {
//         $timeout(function() {
//           $scope.checkPlayerY();
//         }, 100);
//       });
//       angular.element($window).bind('resize', function() {
//         $scope.checkPlayerY();
//       });
//     }
//   };
// })

.directive('scPlayerKnob', ['$window'], function($window) {
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
