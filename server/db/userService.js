/**
 * Created by biqing.hu on 2015/12/7.
 */
var mongoose = require('mongoose');
var config=require('config');
var port=config.get("databaseConfig").port;
var extend= _.extend;

mongoose.connect('mongodb://localhost:'+port);
var db = mongoose.connection;
///////////////////////////////////////////////////////////////////////////////////
var userModel=require('./models/user-model')(mongoose);
var async = require('async');
db.on('error', console.error.bind(console, 'connection error;'));
//添加数据
exports.addData=function(data,cb){
    var user = new userModel(extend({
        username: "",
        password: "",
        salt: "",
        email: "",
        profile: ""
    },data));
    user.save(function (err,data) {
        cb(data);
    });
};

//修改
exports.modifyData= function (condition, cb) {
    userModel.findOneAndUpdate({_id:condition.id}, condition, function (err, user) {
        callback(err, user);
    });
};
//查询数据
exports.queryData = function (condition, cb) {
   userModel.find(condition, function (err, users) {
        cb(err, users);
    });
};
//删除
exports.removeData = function (condition, cb) {
    userModel.remove(condition, function (err, user) {
        cb(err, user);
    });

};

///////////////////////////////////////////////////
var addData = function (callback) {
    // 增加
    var ids = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    async.each(ids, function (id, callback) {
        var user = new userModel({
            username: "tujiaw" + id,
            password: "tujiaw" + id,
            salt: "",
            email: "tujiaw@live.com",
            profile: "profile profile profile profile"
        });
        user.save(function (err, data) {
        });
        callback(null);
    }, function (err) {
        callback(err);
    });
};
var queryData = function (callback) {
    // 查找
    async.parallel({
        one: function (callback) {
            userModel.find(function (err, users) {
                callback(err, users);
            });
        },
        two: function (callback) {
            userModel.find({_id: 2}, function (err, users) {
                callback(err, users);
            });
        },
        three: function (callback) {
            userModel.findOne({_id: 3}, function (err, user) {
                callback(err, user);
            });
        },
        four: function (callback) {
             userModel.findById(4, function (err, user) {
                callback(err, user);
            });
        }
    }, function (err, results) {
        callback(err);
        console.log("---queryData:" + results.two);
    });
};

var removeData = function (callback) {
    // 删除
    async.parallel({
        one: function (callback) {
             userModel.remove({username: "tujiaw5"}, function (err, user) {
                callback(err, user);
            });
        },
        two: function (callback) {
             userModel.findByIdAndRemove(6, function (err, user) {
                callback(err, user);
            });
        },
        three: function (callback) {
             userModel.findOneAndRemove({_id: 7}, function (err, user) {
                callback(err, user);
            });
        }
    }, function (err, results) {
        callback(err);
        console.log("---removeData:" + results.one);
    });
};

var updateData = function (callback) {
    // 更新
    async.parallel({
        one: function (callback) {
             userModel.findOneAndUpdate({_id: 8}, {username: "tujiaw8888"}, function (err, user) {
                callback(err, user);
            });
        }
    }, function (err, results) {
        callback(err);
        console.log("---updateData");
    });
};

db.once('open', function (callback) {
    console.log('open success');
    //async.series({
    //    one: function (callback) {
    //        addData(callback);
    //    },
    //    two: function (callback) {
    //        queryData(callback);
    //    },
    //    three: function (callback) {
    //        removeData(callback);
    //    },
    //    four: function (callback) {
    //        updateData(callback);
    //    }
    //}, function (err, results) {
    //    if (err) {
    //        console.log(err);
    //    }
    //    console.log(results);
    //});
});


