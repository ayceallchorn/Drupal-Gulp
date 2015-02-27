'use strict';


var gulp =require('gulp'),
  config =require('./config.json'),
  sass =require('gulp-ruby-sass'),
  rename =require('gulp-rename'),
  plumber =require('gulp-plumber'),
  jshint =require('gulp-jshint'),
  concat =require('gulp-concat'),
  uglify =require('gulp-uglify'),
  imagemin =require('gulp-imagemin'),
  pngcrush =require('imagemin-pngcrush'),
  size =require('gulp-size'),
  shell =require('gulp-shell');


var onError =function(err) {
  console.log(err.toString());
  this.emit('end');
};

var theme_dir = config.drupal.root + '/' + config.drupal.themes + '/' + config.drupal.theme_name + '/';

var settings = {
  sass_src: [theme_dir + config.sass.src + "/*.sass", theme_dir + config.sass.src + "/**/*.sass"],
  sass_dest: theme_dir + config.sass.dest,
  js_src: theme_dir + config.javascript.src + '/*.js',
  js_dest: theme_dir + config.javascript.dest,
  img_src: theme_dir + config.images.src + '/' + config.images.extensions,
  img_dest: theme_dir + config.images.dest
};

//console.log(settings.sass_src);

gulp.task('styles',function() {
  return gulp.src(settings.sass_src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(sass({
      style:'compressed',
      compass:true,
      precision:10
    }))
    .pipe(gulp.dest(settings.sass_dest))
    .pipe(size({title:'css'}));
});


gulp.task('scripts',function() {
  return gulp.src(settings.js_src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(settings.js_dest))
    .pipe(rename({suffix:".min"}))
    .pipe(uglify())
    .pipe(gulp.dest(settings.js_dest))
  .pipe(size({title:'js'}));
});


gulp.task('images',function() {
  return gulp.src(settings.img_src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(imagemin({
      optimizationLevel:7,
      progressive:true,
      interlaced:true
    }))
    .pipe(gulp.dest(settings.img_dest))
    .pipe(size({title:'images'}));
});


//gulp.task('drush', shell.task([
//  'drush '+ config.drupal.drush_alias +' cache-clear theme-registry'
//]));


gulp.task('default',[],function() {
  gulp.start('styles','scripts','images');
});


gulp.task('watch',[],function() {
  gulp.start('default');
  gulp.watch(settings.js_src,['scripts']);
  gulp.watch(settings.sass_src,['styles']);
  gulp.watch(settings.img_src,['images']);
  //gulp.watch('**/*.{php,inc,info}',['drush']);
});
