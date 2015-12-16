/**
 * Created by biqing.hu on 2015/12/16.
 */
var server = module.exports =require('http').createServer(app);
server.listen(process.env.PORT || 4123, function () {
    console.log('app listened');
    console.log('http://127.0.0.1:' + server.address().port);
});

process.on('uncaughtException', function (err) {
    return console.error(err);
});