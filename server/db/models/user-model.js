//var mongoose = require('mongoose');
module.exports = function (mongoose) {
//用户
    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        salt: String,
        email: String,
        profile: String
    });
    return userModel = mongoose.model('userModel', userSchema);
};