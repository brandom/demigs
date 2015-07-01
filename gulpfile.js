var gulp = require('gulp');
var plug = require('gulp-load-plugins')();
var bower = require('main-bower-files');
var rimraf = require('rimraf');
var merge = require('merge2');
var browserSync = require('browser-sync').create();
var paths = require('./gulp.config.json');
historyApiFallback = require('connect-history-api-fallback');

gulp.task('js', function() {
  var vendor = gulp.src(bower())
    .pipe(plug.filter('*.js'))
    .pipe(plug.order(paths.vendorOrder));
    
  var templates = gulp.src(paths.templates)
    .pipe(plug.angularTemplatecache('templates.js', {
      standalone: true
    }));
    
  var js = gulp.src(paths.js)
    .pipe(plug.ngAnnotate());
    
  return merge(vendor, templates, js)
    .pipe(plug.concat('demigs.js'))
    .pipe(gulp.dest(paths.public + 'js'));
});

gulp.task('js-prod', ['js'], function() {
  return gulp.src(paths.public + 'js/demigs.js')
    .pipe(plug.uglify())
    .pipe(gulp.dest(paths.public + 'js'));
});

gulp.task('css', function() {
  var vendor = gulp.src(bower())
    .pipe(plug.filter('*.css'));
    
  var css = gulp.src(paths.css);
  
  return merge(vendor, css)
    .pipe(plug.uglifycss())
    .pipe(plug.concat('demigs.css'))
    .pipe(gulp.dest(paths.public + 'css'));
});


gulp.task('build', ['js', 'css']);

gulp.task('prod', ['js-prod', 'css']);

gulp.task('default', ['build', 'browser-sync', 'watch']);

gulp.task('watch', function() {
  var js = [].concat(paths.js).concat(paths.templates);
  var css = [].concat(paths.css);
  
  console.log('Watching all files');

  gulp.watch(css, ['css'])
    .on('change', logWatch);
  
  gulp.watch(js, ['js'])
    .on('change', logWatch);

  function logWatch(event) {
    console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks..');
  }
});

gulp.task('browser-sync', function() {
  browserSync.init({
    ui: false,
    server: {
      baseDir: "./public",
      middleware: [ historyApiFallback() ]
    },
    ghostMode: { // these are the defaults t,f,t,t
      clicks: false,
      location: false,
      forms: false,
      scroll: false
    },
    files: ['./public/**/*.*'],
    notify: true,
    logPrefix: 'BS'
  });
});