'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    jade= require('gulp-jade'),
    plumber = require('gulp-plumber'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    spritesmith = require('spritesmith'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cleancss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    rimraf = require('rimraf'),
    graceful = require('graceful-fs'),
    gutil = require('gulp-util'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    //export paths
    build: {
        fonts: 'build/fonts/',
        img: 'build/img/',
        //html: 'build/',
        jade: 'build/',
        js: 'build/js/',
        css: 'build/style',
        foundjs: 'build/js/'
    },
    //source paths
    src: {
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.*',
        //html: 'src/*.html',
        jade: 'src/jade/*.jade',
        js: 'src/js/*.js',
        foundjs: 'bower_components/foundation-sites/js/foundation.',
        css: 'src/style/*.scss'
    },
    //whatcher paths
    watch: {
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.*',
        //html: 'src/**/*.html',
        jade: 'src/jade/**/*.jade',
        js: 'src/js/**/*.js',
        css: 'src/style/**/*.scss'
    },
    clean: './build',
    util: 'src/js/util'
};

//config for the web server
var config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "heritage"
};


function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('jade:build', function () {
   gulp.src(path.src.jade)
       .pipe(jade({pretty: true}))
       .pipe(gulp.dest(path.build.jade))
       .on('error', function(err) { gutil.log(err.message); })
       .pipe(reload({stream: true}));

});

//gulp.task('html:build', function () {
//    gulp.src(path.src.html)
//        .pipe(rigger())
//        .pipe(gulp.dest(path.build.html))
//        .pipe(reload({stream: true}));
//});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())  //throw error when connect foundation core js files
        .pipe(sourcemaps.write('../js'))
        .pipe(gulp.dest(path.build.js))
        .on('error', function(err) { gutil.log(err.message); })
        .pipe(reload({stream: true}));
});

// JSHint, concat, and minify Foundation JavaScript
gulp.task('foundation-js:build', function () {
    return gulp.src([

            // Foundation core - needed if you want to use any of the components below
            path.src.foundjs + 'core.js',
            path.src.foundjs + 'util.*.js',

            // Pick the components you need in your project
            path.src.foundjs + 'abide.js',
            path.src.foundjs + 'accordion.js',
            path.src.foundjs + 'accordionMenu.js',
            path.src.foundjs + 'drilldown.js',
            path.src.foundjs + 'dropdown.js',
            path.src.foundjs + 'dropdownMenu.js',
            path.src.foundjs + 'equalizer.js',
            path.src.foundjs + 'interchange.js',
            path.src.foundjs + 'magellan.js',
            path.src.foundjs + 'offcanvas.js',
            path.src.foundjs + 'orbit.js',
            path.src.foundjs + 'responsiveMenu.js',
            path.src.foundjs + 'responsiveToggle.js',
            path.src.foundjs + 'reveal.js',
            path.src.foundjs + 'slider.js',
            path.src.foundjs + 'sticky.js',
            path.src.foundjs + 'tabs.js',
            path.src.foundjs + 'toggler.js',
            path.src.foundjs + 'tooltip.js'
        ])
        .pipe(babel({
            compact: true
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('foundation.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())//dosesn't work =/
        .pipe(sourcemaps.write(path.build.foundjs)) // Creates sourcemap for minified Foundation JS
        .pipe(gulp.dest(path.build.foundjs))
});

gulp.task('style:build', function () {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(rigger())
        .pipe(prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleancss())
        .pipe(sourcemaps.write('../style'))
        .pipe(gulp.dest(path.build.css))
        .on('error', function(err) { gutil.log(err.message); })
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    //'html:build',
    'jade:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build',
    'foundation-js:build'
]);

gulp.task('watch', function () {
    //watch([path.watch.html], function (event, cb) {
    //    gulp.start('html:build');
    //});
    watch([path.watch.jade], function (event, cb) {
        gulp.start('jade:build');
    });
    watch([path.watch.css], function (event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });

});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);