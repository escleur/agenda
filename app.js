var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');

//require('express-mongoose');

var models = require('./models');
var routes = require('./routes/index');
var users = require('./routes/users');
var middleware = require('./middleware');

var app = express();

mongoose.connect('mongodb://admin:CKYgfL3c3yXL@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/agenda', function(err){
	if(err){
		console.log('Active la base de datos');
		throw err;
	}
	middleware(app);
	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	//app.use(bodyParser.json());
	//app.use(bodyParser.urlencoded({ extended: false }));
	//app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));
	
	app.get('/health', function(req, res, next){
            res.writeHead(200);
            res.end();
	  }
	);
	app.use('/', routes);

	app.use('/users', users);

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
		  message: err.message,
		  error: err
		});
	  });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
		message: err.message,
		error: {}
	  });
	});
});

module.exports = app;
