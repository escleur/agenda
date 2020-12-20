var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');

module.exports = function (app) {
  //app.use(express.logger('dev'));

  // this is good enough for now but you'll
  // want to use connect-mongo or similar
  // for persistant sessions
  app.use(cookieParser());
  app.use(session({ secret: 'calendorocopy',
					resave: false,
					saveUninitialized: false,
					name:'secionAgenda'
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // expose session to views
//  app.use(function (req, res, next) {
	  
//	  console.log('aca');
//	  console.log(session);
//	  console.log('aca');
//    res.locals.session = req.session;
//    next();
//  })
}
