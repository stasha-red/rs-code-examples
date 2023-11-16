import gulp from 'gulp';
import htmlmin from 'gulp-htmlmin';
import { deleteAsync } from 'del';

function html() {
    // 1. взять html
    // 2. минифицировать
    // 3. сохранить результат

    return gulp.src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
}

function clean() {
    return deleteAsync(['dist/**'])
}

export { clean, html };

export default gulp.series(clean, html)