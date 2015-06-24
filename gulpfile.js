var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require('gulp-order');
var bower = require('main-bower-files');
var rimraf = require('rimraf');
var filter = require('gulp-filter');
var debug = require('gulp-debug');

var paths = {
  vendorJS: [
    'jquery.js',
    'jquery.bridget.js',
    'get-style-property.js',
    'get-size.js',
    'EventEmitter.js',
    'eventie.js',
    'doc-ready.js',
    'matches-selector.js',
    'item.js',
    'outlayer.js',
    'masonry.js',
    'imagesloaded.js',
    'angular.js',
    'angular-masonry.js',
    'angular*.js',
    'underscore.js',
    'moment.js',
    '*.js'
  ],
  public: 'public/'
};

gulp.task('js', function() {
  return gulp.src(bower())
    .pipe(filter('*.js'))
    .pipe(order(paths.vendorJS))
    // .pipe(debug())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.public + 'js'));
})

gulp.task('css', function() {
  return gulp.src(bower())
  .pipe(filter('*.css'))
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest(paths.public + 'css'));
})

gulp.task('build', ['js', 'css']);

gulp.task('default', ['build', 'watch']);

gulp.task('watch', function() {
  console.log('Watching all files');

  gulp.watch('./public/**/*', ['build'])
    .on('change', logWatch);

  function logWatch(event) {
    console.log('*** File ' + event.path + ' was ' + event.type + ', running tasks..');
  }
});

//'less', 'js', 'js-view', 'dist'