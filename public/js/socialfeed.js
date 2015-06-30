angular.module('brSocialFeed', [])

.factory('SocialFeed', function($http, $q) {
  
  var defaults = {
    plugin_folder: '', // a folder in which the plugin is located (with a slash in the end)
    template: 'template.html', // a path to the tamplate file
    show_media: true, // show images of attachments if available
    length: 10000 // maximum length of post message shown
  };
  
  var instagramResults = [];
  var twitterResults = [];

  var options = _.extend(defaults, {
    instagram:{
      accounts: ['@thedemigs','#thedemigs','#demigin'],
      limit: 30,
      client_id: '4afddf3b7ce44958979c2fcc8432dd3b'
    },
    twitter:{
      accounts: ['@thedemigs','#demigin'],
      limit: 30,
      consumer_key: '5zLQG35QzfZp8KCrgcHoMKxhH', // make sure to have your app read-only
      consumer_secret: 'O7llcLCmEYaoEWY7VOWdH0IagmCLbU1cfuOSDuBdMIBEeNEl95' // make sure to have your app read-only
    }
  }),
  // container = $(this),
  // template,
  social_networks = ['instagram', 'twitter'];
  // social_networks = ['twitter'];
  
  var defer = $q.defer();
  
  var Utility = {
    request: function(url, callback) {
      url = url + 'JSON_CALLBACK'
      $http.jsonp(url)
      .success(function(data) {
        callback(data);
      });
    },
    get_request: function(url, callback) {
      $http.get(url)
      .success(function(data) {
        callback(data);
      });
    },
    wrapLinks: function(string, social_network) {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      if (social_network === 'google-plus') {
        string = string.replace(/(@|#)([a-z0-9_]+['])/ig, Utility.wrapGoogleplusTagTemplate);
      } else {
        string = string.replace(exp, Utility.wrapLinkTemplate);
      }
      return string;
    },
    wrapLinkTemplate: function(string) {
      return '<a target="_blank" href="' + string + '">' + string + '<\/a>';
    },
    wrapGoogleplusTagTemplate: function(string) {
      return '<a target="_blank" href="https://plus.google.com/s/' + string + '" >' + string + '<\/a>';
    },
    shorten: function(string) {
      string = string.replace(/\s\s+/g, '');
      if (string.length > options.length) {
        return string.substring(0, options.length).split(" ").slice(0, -1).join(" ") + "...";
      } else {
        return string;
      }
    },
    stripHTML: function(string) {
      if (typeof string === "undefined" || string === null) {
        return '';
      }
      return string.replace(/(<([^>]+)>)|nbsp;|\s{2,}|/ig, "");
    },
    SortByDate: function(a, b) {
      if (a.dt_create > b.dt_create) {
        return 1;
      }
      if (a.dt_create < b.dt_create) {
        return -1;
      }
    }
  };
    
  var SocialFeedPost = function(social_network, data) {
    this.content = data;
    this.content.attachment = (this.content.attachment == undefined) ? '' : this.content.attachment;
    this.content.time_ago = data.dt_create.fromNow();
    this.content.dt_create = this.content.dt_create.valueOf();
    this.content.text = Utility.wrapLinks(Utility.shorten(data.message + ' ' + data.description), data.social_network);
    this.content.moderation_passed = (options.moderation) ? options.moderation(this.content) : true;
    
    // _.each()
    
    Feed.posts.push(this.content);
    defer.notify(Feed.posts);
  }
    
  var Feed = {
    posts: [],
    template: false,
    init: function() {
      Feed.posts = [];
      // Feed.getTemplate(function() {
        social_networks.forEach(function(network) {
          if (options[network]) {
            //loaded[network] = 0;
            options[network].accounts.forEach(function(account) {
              //loaded[network]++;
              Feed[network].getData(account);
            });
          }
        });
        // Feed.posts.sort(Utility.SortByDate);
      // });
    },
    // getTemplate: function(callback) {
    //   if (Feed.template) {
    //     return callback();
    //   } else {
    //     if (options.template_html) {
    //       Feed.template = doT.template(options.template_html);
    //       return callback();
    //     } else {
    //       $.get(options.template, function(template_html) {
    //         Feed.template = doT.template(template_html);
    //         return callback();
    //       });
    //     }
    //   }
    // },
    twitter: {
      posts: [],
      loaded: false,
      // api: 'http://api.tweecool.com/',
      
      getData: function(account) {
        
        var cb = new Codebird;
        cb.setConsumerKey(options.twitter.consumer_key, options.twitter.consumer_secret);
        
        switch (account[0]) {
          case '@':
            var userid = account.substr(1);
            cb.__call(
              "statuses_userTimeline",
              "id=" + userid + "&count=" + options.twitter.limit,
              Feed.twitter.utility.getPosts,
              true // this parameter required
            );
            break;
          case '#':
            var hashtag = account.substr(1);
            cb.__call(
              "search_tweets",
              "q=" + hashtag,
              function(reply) {
                Feed.twitter.utility.getPosts(reply.statuses);
              },
              true // this parameter required
            );
            break;
          default:
        }
      },
      utility: {
        getPosts: function(json) {
          _.each(json, function(element) {
            // var element = this;
            var post = new SocialFeedPost('twitter', Feed.twitter.utility.unifyPostData(element));
          });
        },
        unifyPostData: function(element) {
          var post = {};
          post.id = element.id;
          // Fix Invalid Date in Safari/Firefox
          // post.dt_create = moment(new Date(Feed.twitter.utility.fixTwitterDate(element.created_at)));
          // After refactor compare post.id with list of post ids (don't allow dupes)
          // Get urls from twitter and filter out instragram links
          post.dt_create = moment(new Date(element.created_at));
          post.author_link = 'http://twitter.com/' + element.user.screen_name;
          post.author_picture = element.user.profile_image_url;
          post.post_url = post.author_link + '/status/' + element.id_str;
          post.author_name = element.user.name;
          post.message = element.text;
          post.description = '';
          post.social_network = 'twitter';
          post.link = 'http://twitter.com/' + element.user.screen_name + '/status/' + element.id_str;
          
          if (options.show_media === true) {
            if (element.entities.media && element.entities.media.length > 0) {
              image_url = element.entities.media[0].media_url;
              if (image_url) {
                post.attachment = '<img class="attachment" src="' + image_url + '" />';
              }
            }
          }
          return post;
        },
        fixTwitterDate: function(created_at) {
          if (created_at !== undefined) {
            created_at = created_at.replace('+0000', 'Z');
            return created_at;
          }
        }
      }
    },
    facebook: {
      posts: [],
      graph: 'https://graph.facebook.com/',
      loaded: false,
      getData: function(account) {
        var request_url, limit = 'limit=' + options.facebook.limit,
        query_extention = '&access_token=' + options.facebook.access_token + '&callback=';
        switch (account[0]) {
          case '@':
            var username = account.substr(1);
            
            request_url = Feed.facebook.graph + username + '/posts?' + limit + query_extention;
            Utility.request(request_url, Feed.facebook.utility.getPosts);
            break;
          case '#':
            var hashtag = account.substr(1);
            
            request_url = Feed.facebook.graph + 'search?q=%23' + hashtag + '&' + limit + query_extention;
            Utility.request(request_url, Feed.facebook.utility.getPosts);
            break;
          default:
            request_url = Feed.facebook.graph + 'search?q=' + account + '&' + limit + query_extention;
            Utility.request(request_url, Feed.facebook.utility.getPosts);
        }
      },
      utility: {
        getPosts: function(json) {
          if (json['data']) {
            json['data'].forEach(function(element) {
              var post = new SocialFeedPost('facebook', Feed.facebook.utility.unifyPostData(element));
            });
          }
        },
        unifyPostData: function(element) {
          var post = {},
          text = (element.message) ? element.message : element.story;
          
          post.id = element.id;
          post.dt_create = moment(element.created_time);
          post.author_link = 'http://facebook.com/' + element.from.id;
          post.author_picture = Feed.facebook.graph + element.from.id + '/picture';
          post.author_name = element.from.name;
          if (text) {
            post.message = text;
          }
          post.description = (element.description) ? element.description : '';
          post.link = (element.link) ? element.link : 'http://facebook.com/' + element.from.id;
          post.social_network = 'facebook';
          
          if (options.show_media === true) {
            if (element.picture) {
              var image_url = element.picture;
              if (element.object_id) {
                image_url = Feed.facebook.graph + element.object_id + '/picture/?type=normal';
              } else {
                image_url = image_url + "&w=500&h=500"
              }
              post.attachment = '<img class="attachment" src="' + image_url + '" />';
            }
          }
          return post;
        }
      }
    },
    google: {
      posts: [],
      loaded: false,
      api : 'https://www.googleapis.com/plus/v1/',
      getData: function(account) {
        var request_url;
        switch (account[0]) {
          case '#':
            var hashtag = account.substr(1);
            request_url = Feed.google.api + 'activities?query=' + hashtag + '&key=' + options.google.access_token + '&maxResults=' + options.google.limit;
            Utility.request(request_url, Feed.google.utility.getPosts);
            break;
            
          case '@':
            var username = account.substr(1);
            request_url = Feed.google.api + 'people/' + username + '/activities/public?key=' + options.google.access_token + '&maxResults=' + options.google.limit;
            Utilityrequest(request_url, Feed.google.utility.getPosts);
            break;
            
          default:
        }
      },
      utility: {
        getPosts: function(json) {
          json.items.forEach(function(element) {
            var post = new SocialFeedPost('google', Feed.google.utility.unifyPostData(element));
          });
        },
        unifyPostData: function(element) {
          var post = {};
          
          post.id = element.id;
          post.attachment = '';
          post.description = '';
          post.dt_create = moment(element.published);
          post.author_link = element.actor.url;
          post.author_picture = element.actor.image.url;
          post.author_name = element.actor.displayName;
                
          if (options.show_media === true) {
            if (element.object.attachments) {
              _.each(element.object.attachments, function() {
                var image = '';
                if (this.fullImage) {
                  image = this.fullImage.url;
                } else {
                  if (this.objectType == 'album') {
                    if (this.thumbnails && this.thumbnails.length > 0) {
                      if (this.thumbnails[0].image) {
                        image = this.thumbnails[0].image.url;
                      }
                    }
                  }
                }
                post.attachment = '<img class="attachment" src="' + image + '"/>';
              });
            }
          }
          if (element.object.content === '') {
            _.each(element.object.attachments, function() {
              if (this.content !== undefined) {
                post.message = this.content;
              } else if (this.displayName !== undefined) {
                post.message = this.displayName + '<br />' + this.url;
              }
            });
          } else {
            post.message = element.object.content;
          }
          post.social_network = 'google-plus';
          post.link = element.url;
          
          return post;
        }
      }
    },
    instagram: {
      posts: [],
      loaded: false,
      getData: function(account) {
        var url,
        limit = 'count=' + options.instagram.limit,
        query_extention = 'client_id=' + options.instagram.client_id + '&' + limit + '&callback=',
        igm_api_base = 'https://api.instagram.com/v1/';
        
        switch (account[0]) {
          case '@':
            var username = account.substr(1);
            url = igm_api_base + 'users/search/?q=' + username + '&' + query_extention;
            // Utility.request(url, Feed.instagram.utility.getUsers);
            $http.jsonp(url + 'JSON_CALLBACK')
            .success(function(json) {
              json.data.forEach(function (user) {
                if (user.username.toLowerCase() === username.toLowerCase()) {
                  var url = igm_api_base + 'users/' + user.id + '/media/recent/?' + query_extention;
                  Utility.request(url, Feed.instagram.utility.getImages);
                }
              });
            });
            break;
          case '#':
            var hashtag = account.substr(1);
            url = igm_api_base + 'tags/' + hashtag + '/media/recent/?' + query_extention;
            Utility.request(url, Feed.instagram.utility.getImages);
            break;
          default:
        }
      },
      utility: {
        getImages: function(json) {
          json.data.forEach(function(element) {
            if (_.indexOf(instagramResults, element.id) < 0) {
              var post = new SocialFeedPost('instagram', Feed.instagram.utility.unifyPostData(element));
            }
          });
        },
        getUsers: function(json, username) {
          json.data.forEach(function(user) {
            if (user.username == username) {
              var url = igm_api_base + 'users/' + user.id + '/media/recent/?' + query_extention;
              Utility.request(url, Feed.instagram.utility.getImages);
            }
          });
        },
        unifyPostData: function(element) {
          var post = {};
          instagramResults.push(element.id);
          post.id = element.id;
          post.dt_create = moment(element.created_time * 1000);
          post.author_link = 'http://instagram.com/' + element.user.username;
          post.author_picture = element.user.profile_picture;
          post.author_name = element.user.full_name;
          post.message = (element.caption && element.caption) ? element.caption.text : '';
          post.description = '';
          post.social_network = 'instagram';
          post.link = element.link;
          if (options.show_media) {
            post.attachment = '<img class="attachment" src="' + element.images.standard_resolution.url + '' + '" />';
          }
          return post;
        }
      }
    }
  };
  
  return {
    load: function() {
      Feed.init();
      // return Feed;
      return defer.promise;
    }
  };
  
})