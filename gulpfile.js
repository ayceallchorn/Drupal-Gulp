'use strict';


var gulp =require('gulp'),
  sass =require('gulp-ruby-sass'),
  autoprefixer =require('gulp-autoprefixer'),
  csscomb =require('gulp-csscomb'),
  minifyCSS =require('gulp-minify-css'),
  rename =require('gulp-rename'),
  bless =require('gulp-bless'),
  gcmq =require('gulp-group-css-media-queries'),
  plumber =require('gulp-plumber'),
  jshint =require('gulp-jshint'),
  concat =require('gulp-concat'),
  uglify =require('gulp-uglify'),
  imagemin =require('gulp-imagemin'),
  pngcrush =require('imagemin-pngcrush'),
  size =require('gulp-size'),
  shell =require('gulp-shell');


var config = {
  sass:'./src/sass/*.scss',
  css:'./styles',
  js:'./src/js',
  jsmin:'./js',
  images:'./images/*.{png,gif,jpeg,jpg,svg}',
  imagesmin:'./images/minified'
};


var AUTOPREFIXER_BROWSERS = [
  '> 1%',
  'ie >= 8',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4',
  'bb >= 10'
];


var onError =function(err) {
  console.log(err.toString());
  this.emit('end');
};


gulp.task('styles',function() {
  return gulp.src(config.sass)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({
      style:'expanded',
      compass:true,
      precision:10
    }))
    .pipe(gcmq())
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS,
      cascade:false
    }))
    .pipe(csscomb())
    .pipe(gulp.dest(config.css))
    .pipe(minifyCSS())
    .pipe(rename({suffix:".min"}))
    .pipe(bless())
    .pipe(gulp.dest(config.css))
    .pipe(size({title:'css'}));
});


gulp.task('scripts',function() {
  return gulp.src(config.js +'/**/*.js')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(config.jsmin))
    .pipe(rename({suffix:".min"}))
    .pipe(uglify())
    .pipe(gulp.dest(config.jsmin))
  .pipe(size({title:'js'}));
});


gulp.task('images',function() {
  return gulp.src(config.images)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(imagemin({
      optimizationLevel:7,
      progressive:true,
      interlaced:true,
    }))
    .pipe(gulp.dest(config.imagesmin))
    .pipe(size({title:'images'}));
});


gulp.task('drush', shell.task([
  'drush cache-clear theme-registry'
]));


gulp.task('default',[],function() {
  gulp.start('styles','scripts','images');
});


gulp.task('watch',[],function() {
  gulp.watch(config.js,['scripts']);
  gulp.watch(config.sass,['styles']);
  gulp.watch(config.images,['images']);
  gulp.watch('**/*.{php,inc,info}',['drush']);
});
