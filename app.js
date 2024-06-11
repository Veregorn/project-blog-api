const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose'); // Import mongoose

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Load the environment variables
require('dotenv').config();

// Set up default mongoose connection
mongoose.set('strictQuery', false);
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbURI = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority&appName=myAtlasClusterEDU`;

main().catch(err => console.error(err));
async function main() {
  await mongoose.connect(dbURI);
  console.log("Connected to MongoDB");
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
