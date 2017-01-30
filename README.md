# gulp-res-to-hash

Смотрит файл и по его ресурсу пдставляет хеш

# Пример задачи

``` js
gulp.task('restohash', function() {

    var filename = minimist(process.argv).name || '*'

    return gulp
        .src('./dest/' + filename + '.html')
        .pipe(gulpResToHash())
        .pipe(gulp.dest(function(file) {
            return file.base;
        }));

});
```
