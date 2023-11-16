import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import {deleteAsync} from 'del';
import svgSprite from 'gulp-svg-sprite';
import webpackStream from 'webpack-stream';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);

function server() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

function watch() {
    gulp.watch(['src/style.scss', 'src/scss/*'], styles);
    gulp.watch(['src/app.js'], scripts);
    gulp.watch(['src/fonts/*', 'src/assets/*'], copy);
}

function scripts() {
    // 1. сначала нужно взять JavaScript файлы
    // 2. при необходимости переписать новый синтаксис с учетом браузерной поддержки
    // 3. минифицировать код
    // 4. переименовать, добавить суффикс min
    // 5. сохранить результат в новый файл 
    return gulp.src('src/app.js')
        .pipe(webpackStream({
            mode: 'production',
            module: {
                rules: [
                  {
                    test: /\.(?:js)$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
}

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
    .pipe(browserSync.stream())
}

function copy() {
    return gulp.src(['src/index.html', 'src/fonts/*', 'src/assets/*'], { base: 'src'})
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({
			once: true
		}))
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

export { styles, clean, copy, svg, scripts, server, watch };

export default gulp.series(clean, gulp.parallel(copy, styles, scripts), gulp.parallel(server, watch))

export let build = gulp.series(clean, copy, styles, scripts);