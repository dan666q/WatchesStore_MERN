var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const brandRouter = require('./routes/brandRouter');
const watchRouter = require('./routes/watchRouter');
const accountRouter = require('./routes/accountRouter');
const { ensureAuthenticated } = require('./config/auth');

var app = express();

const url = "mongodb://127.0.0.1:27017/SDN_Ass3";
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected to the Database");
}).catch((err) => {
  console.log(err);
});

app.use(cors());

// view engine setup - remove this since you're not using views
// app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/brands', brandRouter);
app.use('/watches', watchRouter);
app.use('/accounts', ensureAuthenticated, accountRouter); // Protect account routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler without view rendering
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
