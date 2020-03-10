var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath)
var fs = require('fs');
const cors = require('cors');
const formidableMiddleware = require('express-formidable');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(formidableMiddleware({
    // encoding: 'utf-8',
    uploadDir: path.join(__dirname, "upload"),
    keepExtensions: true,
    multiples: true, // req.files to be arrays of files
}));
app.use(express.static(path.join(__dirname, 'public')));
app.options('/*', cors())
app.use(function(err, req, res, next) {
    res.header('Access-Control-Allow-Origin', ['*'])
        // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static('build'));
app.use('/dog', express.static('build'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler

// var command = ffmpeg('ESL.m4a')
//     .on('end', () => {
//         console.log('end')
//         fs.unlink('1.txt', () => {
//             console.log('delete')
//         });

//     })
//     .on('error', (err) => {
//         console.log('errro')
//         console.log(err.message)
//     }).save('./content.mp3');


module.exports = app;