/**
 * Created by biqing.hu on 2015/12/16.
 */
var app = require('pm').createMaster({
    'pidfile' : './ds.pid',
});

app.register('group1', __dirname + '/worker.js', {
    'listen' : [process.env.PORT || 4000]
});

app.on('giveup', function (name, num, pause) {
    // YOU SHOULD ALERT HERE!
    console.error(Array.prototype.concat.call(arguments, ['give up']));
});
app.dispatch();
