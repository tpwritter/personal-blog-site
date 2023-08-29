const {src, dest, watch, parallel, series} = require('gulp')
const uglify = require('gulp-uglify-es').default

const concat = require('gulp-concat')
const browsersync = require('browser-sync').create()
const clean = require("gulp-clean")


function browserSync(){
    browsersync.init({
        server:{
            baseDir:'app/'
        }
    })
} 

function styles(){
    return src("app/less/style.css")
}

function js(){
    return src('app/js/main.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browsersync.stream())
}

function cleanDist(){
    return src("dist/")
        .pipe(clean())
}

function build(){
    return src([
        "app/less/post_page.css",
        "app/js/main.min.js",
        "app/**/*.html",
        "app/img/**/*.*",
    ], {base: 'app'})
        .pipe(dest('./dist'))
}

function watchFiles(){
    watch(['app/less/style.css'], styles).on('change', browsersync.reload)
    watch(['app/js/main.js'], js).on('change', browsersync.reload)
    watch(['app/**/*.html']).on('change', browsersync.reload)
}


exports.js = js
exports.watchFiles = watchFiles
exports.browserSync = browserSync
exports.build = series(cleanDist, build)

exports.default = parallel(js,browserSync,watchFiles)