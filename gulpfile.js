var gulp         = require('gulp'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    browser      = require('browser-sync'),
    sourcemaps   = require('gulp-sourcemaps'),
    iconfont     = require('gulp-iconfont'),
    consolidate  = require('gulp-consolidate');

gulp.task('sass', function () {
  return gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe(browser.stream({match: '**/*.css'}));
});

// Font generator
gulp.task("build:icons", function() {
    return gulp.src(["./icons/*.svg"]) //path to svg icons
      .pipe(iconfont({
        fontName: "iconsfont", 
        formats: ["ttf", "eot", "woff", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true
      }))
      .on("glyphs", (glyphs) => {

        gulp.src("./icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "iconsfont",
                fontPath: "../fonts/"
            }))
            .pipe(gulp.dest("./scss/icons")); //generated scss files with classes
      })
      .pipe(gulp.dest("./fonts/")); //icon font destination
});

// Starts a BrowerSync instance
gulp.task('serve', ['sass'], function(){
  browser.init({
        server: {
            baseDir: "./"
        }
    });
});

// Runs all of the above tasks and then waits for files to change
gulp.task('default', ['serve'], function() {    
  gulp.watch(['scss/**/*.scss'], ['sass']);  
  gulp.watch('./**/*.html').on('change', browser.reload);
});