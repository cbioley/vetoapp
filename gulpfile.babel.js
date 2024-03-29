/* eslint-disable no-undef, no-console */
import bg from 'gulp-bg';
import del from 'del';
import eslint from 'gulp-eslint';
import fs from 'fs';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import mochaRunCreator from './test/mochaRunCreator';
import os from 'os';
import path from 'path';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import webpackBuild from './webpack/build';
import yargs from 'yargs';

const args = yargs
  .alias('p', 'production')
  .argv;

// To fix some eslint issues: gulp eslint --fix
const runEslint = () => {
  const isFixed = file => args.fix && file.eslint && file.eslint.fixed;
  return gulp.src([
    'gulpfile.babel.js',
    'messages/*.js',
    'src/**/*.js',
    'webpack/*.js'
  ], { base: './' })
    .pipe(eslint({ fix: args.fix }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('./')));
};

gulp.task('env', () => {
  process.env.NODE_ENV = args.production ? 'production' : 'development';
});

gulp.task('clean', () => del('build/*'));

gulp.task('build-webpack', ['env'], webpackBuild);
gulp.task('build', ['build-webpack']);

gulp.task('eslint', () => runEslint());

// Exit process with an error code (1) on lint error for CI build.
gulp.task('eslint-ci', () => runEslint().pipe(eslint.failAfterError()));

gulp.task('mocha', () => {
  mochaRunCreator('process')();
});

// Enable to run single test file
// ex. gulp mocha-file --file src/browser/components/__test__/Button.js
gulp.task('mocha-file', () => {
  mochaRunCreator('process')({ path: path.join(__dirname, args.file) });
});

// Continuous test running
gulp.task('mocha-watch', () => {
  gulp.watch(
    ['src/browser/**', 'src/common/**', 'src/server/**'],
    mochaRunCreator('log')
  );
});

gulp.task('test', done => {
  runSequence('eslint-ci', 'mocha', 'build-webpack', done);
});

gulp.task('server-node', bg('node', './src/server'));
gulp.task('server-hot', bg('node', './webpack/server'));
// Shell fixes Windows este/issues/522, bg is still needed for server-hot.
gulp.task('server-nodemon', shell.task(
  // Normalize makes path cross platform.
  path.normalize('node_modules/.bin/nodemon --ignore webpack-assets.json src/server')
));

gulp.task('server', ['env'], done => {
  if (args.production) {
    runSequence('clean', 'build', 'server-node', done);
  } else {
    runSequence('server-hot', 'server-nodemon', done);
  }
});

// Default task to start development. Just type gulp.
gulp.task('default', ['server']);

// React Native

gulp.task('native', done => {
  // native/config.js
  const config = require('./src/server/config');
  const { appName, defaultLocale, firebaseUrl, locales } = config;
  fs.writeFile('src/native/config.js',
// Yeah, that's how ES6 template string indentation works.
`/* eslint-disable eol-last, quotes, quote-props */
export default ${
  JSON.stringify({ appName, defaultLocale, firebaseUrl, locales }, null, 2)
};`
  );
  // native/messages.js
  const messages = require('./src/server/intl/loadMessages')();
  fs.writeFile('src/native/messages.js',
`/* eslint-disable eol-last, max-len, quotes, quote-props */
export default ${
  JSON.stringify(messages, null, 2)
};`
  );
  done();
});

gulp.task('ios', ['native'], bg('react-native', 'run-ios'));
gulp.task('android', ['native'], bg('react-native', 'run-android'));

// Various fixes for react-native issues. Must be called after npm install.
gulp.task('fix-react-native', done => {
  runSequence('fix-native-babelrc-files', 'fix-native-fbjs', done);
});

// https://github.com/facebook/react-native/issues/4062#issuecomment-164598155
// Still broken in RN 0.20. Remove fbjs from package.json after fix.
gulp.task('fix-native-babelrc-files', () =>
  del(['node_modules/**/.babelrc', '!node_modules/react-native/**'])
);

// https://github.com/facebook/react-native/issues/5467#issuecomment-173989493
// Still broken in RN 0.20. Remove fbjs from package.json after fix.
gulp.task('fix-native-fbjs', () =>
  del(['node_modules/**/fbjs', '!node_modules/fbjs'])
);

// Tasks for issues seem to be already fixed.

// Fix for custom .babelrc cache issue.
// https://github.com/facebook/react-native/issues/1924#issuecomment-120170512
gulp.task('clear-react-packager-cache', () => {
  // Clear react-packager cache
  const tempDir = os.tmpdir();

  const cacheFiles = fs.readdirSync(tempDir).filter(
    fileName => fileName.indexOf('react-packager-cache') === 0
  );

  cacheFiles.forEach(cacheFile => {
    const cacheFilePath = path.join(tempDir, cacheFile);
    fs.unlinkSync(cacheFilePath);
    console.log('Deleted cache: ', cacheFilePath);
  });

  if (!cacheFiles.length) {
    console.log('No cache files found!');
  }
});

// No mocha right now, because app has no tests yet. Testing is overrated.
gulp.task('deploy', ['eslint-ci'], shell.task([
  // TODO: This should be atomic somehow to prevent queues fails.
  'git push heroku master',
  'firebase deploy'
]));

gulp.task('extractDefaultMessages', () => {
  const through = require('through2');
  const babel = require('babel-core');
  const messages = [];

  const getReactIntlMessages = code => babel.transform(code, {
    plugins: ['react-intl'],
    presets: ['es2015', 'react', 'stage-1']
  }).metadata['react-intl'].messages;

  return gulp.src([
    'src/**/*.js'
  ])
  .pipe(through.obj((file, enc, cb) => {
    const code = file.contents.toString();
    messages.push(...getReactIntlMessages(code));
    cb(null, file);
  }))
  .on('end', () => {
    messages.sort((a, b) => a.id.localeCompare(b.id));
    const eslint = '/* eslint-disable max-len, quote-props, quotes */';
    const json = JSON.stringify(messages, null, 2);
    // ES6 allows us to use multiline strings and eslint.
    const es6code = `${eslint}\nexport default ${json};\n`;
    fs.writeFile('messages/_default.js', es6code);
  });
});
