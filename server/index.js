
'use strict';
var path = require('path');
var fs = require('fs');
var http = require('http');

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
GLOBAL._ = require('lodash');
GLOBAL.CONFIG = require('config');
GLOBAL.Q = require('q');
GLOBAL.moment = require('moment');
moment.locale('zh-cn');
GLOBAL.superagent = require('superagent');
GLOBAL.util=require('util');
require('q-superagent');
var favicon = require('serve-favicon');
var debug = require('debug')('index');
var expstate = require('express-state');
var useragent = require('express-useragent');
var domain = require('domain');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');     //

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

//app.error(function(err, req, res){ res.render('500.jade', { error: err }); });//不知道有没有用
//异常拦截
app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on('error', function (err) { // 下面抛出的异常在这里被捕获
        console.error('[error domain]');
        console.error(err.stack);
        next(err);
    });

    reqDomain.run(next);
});
//超时拦截 放在路由之前
app.use(function (req, res, next) {
    req.timeoutHandle = setTimeout(function () {
        if (res.headersSent) return;
        console.error('[timeout] ' + req.url);
        throw new Error('request timeout'); // 所有请求设置一分钟的超时
    }, 60000);
    next();
});

app.use('/', require('./routers'));
app.use('/api', require('./routers/api'));


module.exports=require('http').createServer(app);