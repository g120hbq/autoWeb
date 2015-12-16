/**
 * Created by biqing.hu on 2015/12/16.
 */
var server = module.exports =require('./server');
server.listen(process.env.PORT || 4123, function () {
    console.log('app listened');
    var url='http://127.0.0.1:' + server.address().port;
    console.log(url);
  //  openBrowser(url);
});

process.on('uncaughtException', function (err) {
    return console.error(err);
});


////打开浏览器
var child_process = require('child_process');
var openBrowser = function (url){
    child_process.exec('start '+url,
    function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + 'start '+url);
        }
    });
}