import gulp from 'gulp';

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCss from 'gulp-clean-css';

import rename from 'gulp-rename';
import { deleteAsync } from 'del';

import webpackStream from 'webpack-stream';
import htmlmin from 'gulp-htmlmin';
import svgSprite from 'gulp-svg-sprite';
import webp from 'gulp-webp';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);

function styles() {
	return gulp.src('src/style.scss')
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCss())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
}

function html() {
	return gulp.src('src/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
}

function scripts() {
	return gulp.src('src/app.js')
		.pipe(webpackStream({
			mode: 'production',
			module: {
				rules: [
					{
						test: /\.m?js$/,
						exclude: /(node_modules)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
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

function svg() {
	return gulp.src('src/assets/images/icons/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(gulp.dest('src/assets/images'))
}

function towebp() {
	return gulp.src('src/assets/images/content/divider/*.jpg')
		.pipe(webp())
		.pipe(gulp.dest('src/assets/images/content/divider/'))
}

function server() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

function copy() {
	return gulp.src([
		'src/assets/fonts/*', 
		'src/assets/images/!(icons)/**/*', 
		'src/assets/images/!(icons)',
		'src/apple-touch-icon.png', 
		'src/favicon.ico', 
	], { base: 'src' })
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream({
			once: true
		}))
}

function clean() {
    return deleteAsync(['dist/**'])
}

function watch() {
	gulp.watch(['src/assets/fonts/*', 'src/assets/images/**/*', '!src/assets/images/!(icons)/*'], copy);
	gulp.watch(['src/assets/images/icons/*'], svg);
	gulp.watch(['src/assets/images/content/divider/*'], towebp);
	gulp.watch('src/**/*.scss', styles);
	gulp.watch(['src/*.js'], scripts);
	gulp.watch('src/*.html', html);
}

export { svg, towebp }

export const build = gulp.series(clean, html, styles, scripts, copy);

export default gulp.series(clean, gulp.parallel(html, styles, scripts, copy), gulp.parallel(server, watch));
