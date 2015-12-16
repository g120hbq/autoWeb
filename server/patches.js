'use strict';

var http = require('http');

var Q = require('q');
var _ = require('lodash');

var utils = require('express/lib/utils');
var resProto = require('express/lib/response');
var routerProto = require('express/lib/router');
var routeProto = require('express/lib/router/route').prototype;

require('q-locals')(resProto);

module.exports = augmentApp;
function augmentApp(app, options) {
    var resProto = app.response;

    resProto.type = (function () {
        var cache = resProto.type;
        return function (type) {
            if (this.headerSent) return;
            if (type == 'json') type = 'application/json; charset=utf-8';
            if (type == 'js') type = 'text/javascript; charset=utf-8';
            return cache.call(this, type);
        }
    }());

    Object.defineProperty(resProto, 'pageBodyId', {
        get: function () {
            return B.namespace(this, 'locals.page').bodyId;
        },
        set: function (bodyId) {
            return B.namespace(this, 'locals.page').bodyId = bodyId;
        }
    });

    Object.defineProperty(resProto, 'pageTitle', {
        get: function () {
            return B.namespace(this, 'locals.page').title;
        },
        set: function (title) {
            return B.namespace(this, 'locals.page').title = title;
        }
    });
}

// 以下方法本来想用来做加载性能优化的，但增加了复杂度，不用了
//
//  resProto.head = function (title) {
//    var res = this;
//    var req = res.req;
//    if (res.headSent) return res.headSent;
//    res.headSent = L.CC4client('zh-cn')
//    .then(function (CC) {
//      req.CC = CC;
//      res.locals.CC = CC;
//      res.type('html');
//      res.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">');
//      res.write('<script>window.CC='+JSON.stringify(CC)+';</script>');
//      res.write(jslib());
//      res.write('<link rel="stylesheet" href="'+css('main/global.css')+'">')
//      res.write('<title>' +(title?title:'载入中……')+ ' - ' + CC.client.title + '</title>');
//      res.write('<!--[if IE]>'+
//        '<link rel="stylesheet" href="'+css('aceie.css')+'" />'+
//        '<![endif]-->'+
//
//        '<!--[if IE 8]>'+
//        '<link id="ie8Hack" rel="stylesheet" href="'+css('ie8.css')+'"/>'+
//        '<![endif]-->'+
//
//        '<!--[if IE 7]>'+
//        '<link id="ie7Hack" rel="stylesheet" href="'+css('ie7.css')+'"/>'+
//        '<![endif]-->'+
//
//        '<!--[if lt IE 7]>'+
//        '<script src="'+js('ext/ie.js')+'"></script>'+
//        '<![endif]-->'+
//
//        '<!--[if lt IE 10]>'+
//        '<script src="'+js('ext/html5.js')+'"></script>'+
//        '<script src="'+js('ext/excanvas.min.js')+'"></script>'+
//        '<![endif]-->');
//      return true;
//    });
//    return res.headSent;
//  };
//
//  resProto.neck = function (bodyId, bodyClass) {
//    var res = this;
//    if (res.neckSent) return res.neckSent;
//    res.neckSent = res.head().then(function () {
//      res.write('</head><body');
//      if (bodyId) res.write(' id="' + bodyId + '"');
//      if (bodyClass) res.write(' class="' + bodyClass + '"');
//      res.write('><div class="wrap">');
//      return true;
//    });
//    return res.neckSent;
//  };
//
//  resProto.topNav = function (bodyId, bodyClass) {
//    var res = this;
//    var req = res.req;
//    if (res.topNavSent) return res.topNavSent;
//    function userPagelet(templateName) {
//      var viewUser = 'common/top-nav/' + templateName + '-user';
//      var viewNull = 'common/top-nav/' + templateName + '-null';
//      var spanId = 'pageletTopNav-' + templateName;
//      if (!req.remainingPagelets) req.remainingPagelets = [];
//      req.remainingPagelets.push(req.user.then(function (user) {
//        if (user) return Q.ninvoke(res, 'render', viewUser, {user: user});
//        else return Q.ninvoke(res, 'render', viewNull);
//      }).then(function (html) {
//        return res.pagelet(spanId, html);
//      }));
//      return '<span id="' + spanId + '"></span>';
//    }
//    res.topNavSent = res.neck().then(function () {
//      return res.renderWrite('common/top-nav/index', {
//        userPagelet: userPagelet
//      });
//      return true;
//    });
//    return res.topNavSent;
//  };
//
//  resProto.css = function (file) {
//    var res = this;
//    return res.head().then(function () {
//      res.write('<link rel="stylesheet" href="'+css(file)+'">');
//      return true;
//    });
//  };
//
//  resProto.js = function (file) {
//    var res = this;
//    return res.head().then(function () {
//      res.write('<script src="'+js(file)+'"></script>');
//      return true;
//    });
//  };
//
//  resProto.style = function (style) {
//    var res = this;
//    return res.head().then(function () {
//      res.write('<style>'+style+'</style>');
//      return true;
//    });
//  };
//
//  resProto.script = function (script) {
//    var res = this;
//    return res.head().then(function () {
//      res.write('<script>'+script+'</script>');
//      return true;
//    });
//  };
//
//  resProto.pagelet = function (id, html) {
//    var res = this;
//    return res.script('$("#' + id + '").replaceWith("' +
//        html.replace(/"/g, '\\"').replace(/<\/script>/g, '<\\/script>') +
//        '");');
//  };
//
//  resProto.title = function (title) {
//    var res = this;
//    var req = res.req;
//    res.write('<script>(function () {document.title="'+title+(req.CC?' - '+req.CC.client.title:'')+'";}());</script>');
//  }
//
//  resProto.footer = function () {
//    var res = this;
//    if (res.footerSent) return res.footerSent;
//    res.write('</div>');// end .wrap
//    res.footerSent = res.renderWrite('common/footer');
//  }
//
//  resProto.renderWrite = function (view, options) {
//    var res = this;
//    options = options || {};
//    return Q.ninvoke(res, 'render', view, options)
//    .then(function (str) {
//      res.write(str);
//      return true;
//    })
//  }
//
//  resProto.renderEnd = function () {
//    var res = this;
//    var req = res.req;
//    Q.all(req.remainingPagelets || [])
//    .then(function (pagelets) {
//      res.end('</body></html>');
//    }).fail(function (err) {
//      console.error(err.stack);
//      res.end('</body></html>');
//    }).done();
//  };
//}
