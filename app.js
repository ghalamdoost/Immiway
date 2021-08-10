var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require( './app_server/models/db');

var anonymousRouter = require('./app_server/routes/anonymous');
var userRouter = require('./app_server/routes/user');
var contentRouter = require('./app_server/routes/content');
var storageRouter = require('./app_server/routes/storage');
var notificationRouter = require('./app_server/routes/notification');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'app_server','views'));
// app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_public', 'dist', 'Capstone')));


app.use('/', (req, res, next) => { 
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization');
next();
});

app.use('/', anonymousRouter);
app.use('/content', contentRouter);
app.use('/user', userRouter);
app.use('/storage', storageRouter);
app.use('/notification', notificationRouter);

app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, 'app_public', 'dist', 'Capstone', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
