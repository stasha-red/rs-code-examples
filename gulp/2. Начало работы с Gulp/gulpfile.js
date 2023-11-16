import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';

import { deleteAsync } from 'del';

import svgSprite from 'gulp-svg-sprite';

const sass = gulpSass(dartSass);

function styles() {
    // 1. взять scss файлы
    // 2. преобразовать код в css
    // 3. сохранить результат
    return gulp.src('src/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 version']))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
}

function copy() {
    return gulp.src(['src/index.html', 'src/fonts/*', 'src/assets/*'], { base: 'src'})
        .pipe(gulp.dest('dist'))
}

function clean() {
    return deleteAsync(['dist/**'])
}

function svg () {
    return gulp.src('src/assets/*.svg')
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: '../sprite.svg'
            }
        }
    }))
    .pipe(gulp.dest('src/assets/'));
}

export { styles, clean, copy, svg };

export default gulp.series(clean, copy, styles)