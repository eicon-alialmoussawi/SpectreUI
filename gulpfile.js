const { series, parallel, src, dest } = require("gulp");
const clean = require('gulp-clean');
const concatCss = require('gulp-concat-css');
const plumber = require('gulp-plumber');
var onError = function (err) {
    console.log(err);
};
  

function cleandist() {
    return src('newcss', { read: false, allowEmpty: true })
        .pipe(clean());
}

function indexPlugins() {
    return src(['public/public_pages/css/indexMainPlugins.css'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concatCss('indexPlugins.css'))
        .pipe(clean())
        .pipe(dest('newcss/indexPlugins/'));
}

function publicInnerCss() {
    return src(['public/public_pages/css/main.css'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concatCss('allPublicInner.css'))
        .pipe(clean())
        .pipe(dest('newcss/publicInnerCss/'));
}

function publicInnerRTLCss() {
    return src(['public/public_pages/css/mainInnerRTL.css'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concatCss('allPublicRTLInner.css'))
        .pipe(clean())
        .pipe(dest('newcss/publicInnerRTLCss/'));
}

function publicRTLCss() {
    return src(['public/public_pages/css/mainRTL.css'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concatCss('allPublicRTLCss.css'))
        .pipe(clean())
        .pipe(dest('newcss/allPublicRTLCss/'));
}

function publicLTRCss() {
    return src(['public/public_pages/css/mainLTR.css'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concatCss('allPublicLTRCss.css'))
        .pipe(clean())
        .pipe(dest('newcss/allPublicLTRCss/'));
}

exports.run = series(cleandist, parallel(publicInnerCss, publicInnerRTLCss, publicLTRCss, publicRTLCss, indexPlugins));