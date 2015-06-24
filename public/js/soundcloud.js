angular.module('brSoundCloud', [])

.constant('Playlist', [
  {
    title: 'Welcome to Hard Times (Vacant Houses)',
    id: 190876146,
    // secret: 's-rxqqK',
    album: 0
  },
  {
    title: 'Crossed Out Names',
    id: 190876041,
    // secret: 's-w6LRP',
    album: 0
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
    play: function() {
      if (Player.track.playState == 1) {
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
    }
  }
  
  function startStream() {
    var deferred = $q.defer();
    console.log(Player.current);
    var src = getURI(Player.current.id, Player.current.secret);
    // src = src + '?';
    console.log(src);
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
  // sound.setVolume(100);
  
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