/**
 * Created by biqing.hu on 2015/12/16.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var less = require('less');
var static_ = require('express/node_modules/serve-static');

var debug = require('debug')('static');

var router = require('express').Router();
module.exports = router;

var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
    //add global.css/js/img function
    require('../both/js/rev-development.js');

    global.jslib = function(filePath) {
        return JSON.parse(fs.readFileSync(path.join(path.join(__dirname, '..', 'client', 'js', 'libs'), filePath), 'utf-8'))
            .concat(['../src/base.js', '../src/rev-development.js'])
            .map(function (filePath) {
                //console.log("#loaded ===>", filePath);
                return global.js(path.normalize('libs/' + filePath));
            })
            .join('');
    };

    router.lessMiddleware = function lessMiddleware(req, res, next) {
        if (!req.url.match(/\.css($|\?)/i)) return next();

        var filePath = path.join(__dirname, '..', 'client', 'css', req.path.replace(/\.css$/i, '.less'));
        fs.readFile(filePath, {encoding: 'utf-8'}, function (err, content) {
            if (err) return next(err.code == 'ENOENT' ? null : err);
            debug('less filePath: %s', filePath);
            /*
             var mqpath = path.relative(path.dirname(filePath), path.join(__dirname, '..', 'client', 'css', req.canUseMediaQuery ? 'mq.less' : 'mqie8.less'));
             debug('mqpath: %s', mqpath);
             content = '@import "' + mqpath + '";\n' + content;
             */

            res.type('css');

            var parser = new less.Parser({
                filename: filePath,
                relativeUrls: true
            });
            parser.parse(content, function (err, tree) {
                if (err) {
                    console.dir(err);
                    return next(err);
                }

                try {
                    var css = tree.toCSS({
                        relativeUrls: true,
                        sourceMapBasepath: __dirname,
                        sourceMapRootpath: 'file:///',
                        sourceMap: true
                    });
                    res.send(css);
                } catch (err) {
                    console.dir(err);
                    res.status(500);
                    res.type('txt');
                    res.end('/*\n' + JSON.stringify(err, null, '  ') + '\n*/');
                }
            });
        });
    }
    router.use('/client/css', router.lessMiddleware);

    var jsPrefix = '/client/js/src';
    router.jsMiddleware = function (req, res, next) {
        if (!req.url.match(/\.js($|\?)/i)) return next();

        var filePath = path.join(__dirname, '..', jsPrefix, req.path);
        res.type('js');

        try {
            var b = L.browserify(filePath);
            b.on('error', function (e) {
                console.log(e.stack);
            });
            b.bundle({
                debug: true
            }).pipe(res);
        } catch (e) {
            console.log(e.stack);
            res.status(500);
            var errMsg = e.toString()
            res.end('/*\n' + errMsg + '\n*\/');
        }
    };
    router.use(jsPrefix, router.jsMiddleware);
    var libJsonPath = path.join(__dirname, '..', 'client', 'js', 'libs', 'lib.json');
    router.jsLibMiddleware = function (req, res, next) {
        var content;
        try {
            content = JSON.parse(fs.readFileSync(libJsonPath), 'utf-8')
                .filter(function (filename) {
                    return filename[0] === '.' && filename.match(/\.js$/i);
                })
                .map(function (filename) {
                    return path.resolve(path.dirname(libJsonPath), filename);
                })
                .map(function (filepath) {
                    return fs.readFileSync(filepath, 'utf-8');
                })
                .join(';\n\n');
        } catch (err) {
            return next(err);
        }
        res.type('js');
        res.send(content);
    };

    router.use('/client', static_(path.join(__dirname, '..', 'client')));
    router.use('/node_modules', static_(path.join(__dirname, '..', 'node_modules')));
    router.use('/both', static_(path.join(__dirname, '..', 'both')));

} else if ('production' == env) {
    /*

     router.use('/dist', static_(path.join(__dirname, '..', 'dist'), {maxAge: 1000*60*60*24*365}));

     //add global.css/js/img function
     require('../both/js/rev-production.js');

     var libsRevMap = require('../dist/js-libs-rev.json');

     global.jslib = function(filePath) {
     return '<script src="' + (CONFIG.staticPrefix || '/public/dist') + '/' + libsRevMap['js/libs/'+filePath.substring(0, filePath.length-2)] + '"></script>';
     }
     */
}
