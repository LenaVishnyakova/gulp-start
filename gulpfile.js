import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const scss = gulpSass(dartSass);

import concat from 'gulp-concat';
import terser from 'gulp-terser';
import browser from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import {deleteAsync} from 'del';


export const styles = () => {
    return gulp.src('app/scss/style.scss')
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browser.stream())
}

const html = () => {
    return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'))
}

const scripts = () => {
    return gulp.src('app/js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(terser())
    .pipe(gulp.dest('dist/js'))
    .pipe(browser.stream())
}

const copyImages = () => {
    return gulp.src('app/images/*.{jpg, png, svg}')
    .pipe(gulp.dest('dist/images'))
}

const cleanDist = () => {
    return deleteAsync(['dist']);
}

const browserSync = (done) => {
    browser.init({
        server: {
          baseDir: 'dist'
        },
        cors: true,
        notify: false,
        ui: false,
      });

      done();
}

const reload = (done) => {
    browser.reload();
    done();
}

const watching = (done) => {
    gulp.watch(['app/scss/style.scss'], styles)
    gulp.watch(['app/*.html'], gulp.series(html, reload))
    gulp.watch(['app/js/*.js'], scripts)

    done();
}

export default gulp.series(cleanDist, copyImages, gulp.parallel(styles, html, scripts), gulp.series(browserSync, watching));