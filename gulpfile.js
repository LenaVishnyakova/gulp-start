const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');


function styles() {
    return src('app/scss/style.scss')
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

function html() {
    return src('app/*.html')
    .pipe(dest('dist'))
}

function scripts() {
    return src('app/js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}

function copyImages() {
    return src('app/images/*.{jpg, png, svg}')
    .pipe(dest('dist/images'))
}

function cleanDist() {
    return src('dist')
    .pipe(clean())
}

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
}

function reload() {
    browserSync.reload();
}

function watching() {
    watch(['app/scss/*.scss'], series(styles))
    watch(['app/js/*.js'], series(scripts))
    watch(['app/*.html'], series(html, reload))
}


exports.default = series(cleanDist, copyImages, parallel(styles, html, scripts), series(browsersync, watching));