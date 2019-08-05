const { src, dest, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const del = require('del');
const htmlCompressor = require('gulp-htmlmin');
const imageCompressor = require('gulp-imagemin');
const jsCompressor = require('gulp-uglify');
const jsLinter = require('gulp-eslint');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');

const reload = browserSync.reload;

let compressHTML = () => {
    return src([
        'src/html/*.html',
        'src/html/**/*.html'
    ])
    .pipe(htmlCompressor({ collapseWhitespace: true }))
    .pipe(dest('dist'));
};

let compileCSSForDev = () => {
    return src('src/styles/main.scss')
        .pipe(sourceMaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            precision: 10
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourceMaps.write())
        .pipe(dest('temp/styles'))
};

let compileCSSForProd = () => {
    return src('src/styles/main.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 10
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(dest('dist/styles'))
};

let transpileJSForDev = () => {
    return src('src/scripts/**/*.js')
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(dest('temp/scripts'));
};

let transpileJSForProd = () => {
    return src('src/scripts/**/*.js')
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest('dist/scripts'));
};

let lintJS = () => {
    return src('src/scripts/*.js')
        .pipe(jsLinter({
            parserOptions: {
                ecmaVersion: 2017,
                sourceType: 'module'
            },
            rules: {
                indent: [2, 4, { SwitchCase: 1 }],
                quotes: [1, 'single'],
                semi: [2, 'always'],
                'linebreak-style': [2, 'unix'],
                'max-len': [0]
            },
            env: {
                es6: true,
                node: true,
                browser: true
            },
            extends: 'eslint:recommended'
        }))
        .pipe(jsLinter.formatEach('compact', process.stderr));
};

let copyUnprocessedAssetsForProd = () => {
    return src([
        'src/*.*',
        'src/**',
        '!src/html/',
        '!src/html/*.*',
        '!src/html/**',
        '!src/img/',
        '!src/**/*.js',
        '!src/styles/**'
    ], {
        dot: true
    })
    .pipe(dest('dist'));
};

let compressImages = () => {
    return src('src/img/**/*')
        .pipe(cache(
            imageCompressor({
                optimizationLevel: 3,
                progressive: true,
                multipass: false,
                interlaced: false
            })
        ))
        .pipe(dest('dist/img'));
};

let serve = () => {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 250,
        browser: 'chrome',
        server: {
            baseDir: [
                'temp',
                'src',
                'src/html'
            ]
        }
    });

    watch('src/scripts/*.js',
        series(lintJS, transpileJSForDev)
    ).on('change', reload);

    watch('src/styles/**/*.scss',
        series(compileCSSForDev)
    ).on('change', reload);

    watch('src/html/**/*.html').on('change', reload);

    watch('src/img/**/*').on('change', reload);
};

async function clean() {
    const fs = require('fs'),
        foldersToDelete = ['./temp', './dist'];

    process.stdout.write('\n');

    for (let i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write('\tThe ' + foldersToDelete[i] + ' directory was found and will be deleted.\n');
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write('\tThe ' + foldersToDelete[i] + ' directory does NOT exist or is NOT accessible.\n');
        }
    }

    process.stdout.write('\n');
}

async function listTasks() {
    let exec = require('child_process').exec;

    exec('gulp --tasks', function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write('An error was likely generated when invoking the "exec" program in the default task.');
        }

        if ('' !== stderr) {
            process.stdout.write('Content has been written to the stderr stream when invoking the "exec" program in the default task.');
        }

        process.stdout.write(`\n\tThis default task does nothing but generate this message. The available tasks are:\n\n${stdout}`);
    });
}

exports.compressHTML = compressHTML;
exports.compileCSSForDev = compileCSSForDev;
exports.compileCSSForProd = compileCSSForProd;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintJS = lintJS;
exports.copyUnprocessedAssetsForProd = copyUnprocessedAssetsForProd;
exports.build = series(
    compressHTML,
    compileCSSForProd,
    lintJS,
    transpileJSForProd,
    compressImages,
    copyUnprocessedAssetsForProd
);
exports.compressImages = compressImages;
exports.serve = series(compileCSSForDev, lintJS, transpileJSForDev, serve);
exports.clean = clean;
exports.default = listTasks;
