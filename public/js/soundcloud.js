angular.module('brSoundCloud', [])

.constant('Playlist', [
  {
    title: 'Welcome to Hard Times (Vacant Houses)',
    id: 190876146,
    album: 0
  },
  {
    title: 'Crossed Out Names',
    id: 190876041,
    // secret: 's-w6LRP',
    album: 0
  },
  {
    title: 'Melamine',
    id: 190876099,
    album: 0
  },
  {
    title: 'Pluto',
    id: 190876719,
    album: 0
  },
  {
    title: 'Paisley Desert',
    id: 190876912,
    album: 0
  },
  {
    title: 'Long Runs The Fox',
    id: 190876868,
    album: 0
  },
  {
    title: 'Everything is a Weapon',
    id: 190876761,
    album: 0
  },
  {
    title: 'Matamoros',
    id: 190876645,
    album: 0
  },
  {
    title: 'Pushers & Pullers',
    id: 190876099,
    album: 0
  },
  {
    title: 'Henry & Maggie',
    id: 190877563,
    album: 0
  },
  {
    title: 'Mr. Timer',
    id: 190877331,
    album: 0
  },
  {
    title: 'Any Other Pattern',
    id: 190877355,
    album: 0
  },
  {
    title: 'Distress Signals',
    id: 190877393,
    album: 0
  },
  {
    title: 'Dead by Monday',
    id: 190878068,
    album: 0
  },
  {
    title: 'One Light Year From Now',
    id: 190877987,
    album: 0
  },
  {
    title: 'Arches',
    id: 190878061,
    album: 0
  },
  {
    title: 'Athena Goes to War',
    id: 190878018,
    album: 0
  },
  {
    title: 'Yeller',
    id: 190878015,
    album: 0
  },
  {
    title: 'Welcome to Hard Times II (Black Cat/White Ghost)',
    id: 190878377,
    album: 0
  },
  {
    title: 'Monochrome Blues',
    id: 190878424,
    album: 0
  },
  {
    title: 'Red Palamino',
    id: 189517327,
    secret: 's-5PKpl',
    album: 1
  },
  {
    title: 'High Co.',
    id: 189517326,
    secret: 's-vq2un',
    album: 1
  },
  {
    title: 'Sophisticates & Sedatives',
    id: 13331134,
    album: 1
  },
  {
    title: 'Canada',
    id: 189517323,
    secret: 's-HKkz2',
    album: 1
  },
  {
    title: 'Calmunism',
    id: 189517322,
    secret: 's-bwsE3',
    album: 1
  },
  {
    title: 'Gusto',
    id: 189517320,
    secret: 's-UuVud',
    album: 1
  },
  {
    title: 'Black Valley Fight',
    id: 71305757,
    album: 1
  },
  {
    title: 'Lowly',
    id: 189517316,
    secret: 's-2DXjA',
    album: 1
  },
  {
    title: 'Minx',
    id: 189517315,
    secret: 's-aE1VL',
    album: 1
  },
  {
    title: 'Both Hands Out',
    id: 189517313,
    secret: 's-80QUq',
    album: 1
  },
  {
    title: 'Get To 16',
    id: 189517312,
    secret: 's-yJwpU',
    album: 1
  },
  {
    title: 'Pistols',
    id: 189517308,
    secret: 's-rlbgE',
    album: 1
  },
  {
    title: 'Chambers Full of Tracers',
    id: 189517306,
    secret: 's-Syu7w',
    album: 1
  },
  {
    title: 'Slum, Alaska',
    id: 189517304,
    secret: 's-P1FM2',
    album: 1
  },
  {
    title: 'Solvents',
    id: 211851692,
    secret: 's-6rN8O',
    album: 2
  },
  {
    title: 'Summer Spiders',
    id: 211851580,
    secret: 's-jSNRX',
    album: 2
  },
  {
    title: 'Humming from Outside',
    id: 211851664,
    secret: 's-w90Fk',
    album: 2
  },
  {
    title: 'The 98th Meridian',
    id: 211853845,
    secret: 's-l5ATt',
    album: 2
  },
  {
    title: 'Dulce', //Wrong?
    id: 211853829,
    secret: 's-UyGhJ',
    album: 2
  },
  {
    title: 'Throw Me Overboard', //Wrong?
    id: 211852806,
    secret: 's-ZXS3X',
    album: 2
  },
  {
    title: 'Cashing In',
    id: 211852263,
    secret: 's-8NgNo',
    album: 2
  },
  {
    title: 'Northwest Skyline',
    id: 211853188,
    secret: 's-FhUPq',
    album: 2
  },
  {
    title: 'My Empty Vessel',
    id: 211855321,
    secret: 's-nKhwf',
    album: 2
  },
  {
    title: 'Japanese Glass',
    id: 211855352,
    secret: 's-Yvyvr',
    album: 2
  },
  {
    title: 'A Curse On The World',
    id: 211855535,
    secret: 's-csRY2',
    album: 2
  },
  {
    title: 'Vandals',
    id: 211855453,
    secret: 's-6j9X6',
    album: 2
  },
  {
    title: 'Methuselah Moonlight',
    id: 211855551,
    secret: 's-58BKr',
    album: 2
  }
])

.factory('SC', function($q, $rootScope, Playlist) {
  SC.initialize({
    client_id: '46a5ccd28e6ec74d98334656278b7863'
  });
  
  var Player = {
    volume: 100,
    controlDisplay: 'fa-play',
    track: {},
    current: Playlist[0],
    duration: 0,
    play: function(track) {
      if (track) {
        Player.current = Playlist[track];
        Playlist.current = track;
        Player.track.stop();
      } else if (Player.track.playState == 1) {
        togglePlayPause();
        return;
      }
      Player.position = undefined;
      Player.duration = 0;
      startStream().then(function(track) {
        track.play({
          volume: Player.volume,
          onfinish: function() {
            Player.next();
          },
          whileloading: function() {
            if($rootScope.$$phase) return;
            $rootScope.$apply(function() {
              Player.duration = Player.track.durationEstimate;
            });
          },
          whileplaying: function() {
            if($rootScope.$$phase) return;
            $rootScope.$apply(function() {
              Player.position = Player.track.position;
            });
          }
        });
        Player.controlDisplay = 'fa-pause';
      });
    },
    next: function() {
      Player.current = Playlist.next();
      if (Player.current === undefined) {
        Playlist.current = 0;
        Player.current = Playlist[0];
        Player.track.stop();
        Player.play();
        return;
      }
      if (Player.track.playState == 1) {
        Player.track.stop();
      }
      Player.play();
    },
    previous: function() {
      Player.current = Playlist.prev();
      if (Player.track.playState == 1) {
        Player.track.stop();
      }
      Player.play();
    },
    setVolume: function(val) {
      if (Player.track.playState) {
        Player.track.setVolume(val);
      };
    },
    getAlbumCover: function() {
      var albumCovers = [
        'assets/img/welcometohardtimes.png',
        'assets/img/citiescanwait.png',
        'assets/img/yardling.png'
      ];
      return albumCovers[Player.current.album];
    }
  }
  
  function startStream() {
    var deferred = $q.defer();
    var src = getURI(Player.current.id, Player.current.secret);
    SC.stream(src, function(sound) {
      Player.track = sound;
      deferred.resolve(sound);
    });
    return deferred.promise;
  }
  
  function togglePlayPause() {
    Player.track.togglePause();
    Player.controlDisplay = (Player.track.paused) ? 'fa-play' : 'fa-pause';
  }
  
  function getURI(id, secret) {
    if (secret) {
      return "/tracks/" + id + "?secret_token=" + secret;
    } else {
      return "/tracks/" + id;
    }
    
  }

  startStream();
  
  return Player;
})

.filter('duration', function() {
  return function(input) {
    var duration = moment.duration(input).format('mm:ss', { trim: false });
    if (duration == '00:00' || undefined) return '';
    return duration;
  };
})

;

// id: 189509763
// secret: s-rxqqK
// <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/189509755%3Fsecret_token%3Ds-w6LRP&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>