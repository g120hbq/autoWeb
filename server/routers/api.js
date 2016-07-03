/**
 * Created by biqing.hu on 2015/12/16.
 */
var router = require('express').Router();
module.exports = router;
var userService = require('../db/userService');
router.get('/test', function (req, res, next) {

    res.json({a: 1, b: 2, c: 3});
    res.end();
});
router.get('/users',function (req, res, next) {
    userService.queryData(req.query,function(result){
        res.json(result);
        res.end();
    });
});
router.get('/users:id',function (req, res, next) {
    userService.queryData(req.id,function(result){
        res.json(result);
        res.end();
    });
});
router.post('/users',function (req, res, next) {
    userService.addData(req.body,function(result){
        res.json(result);
        res.end();
    });
});
router.put('/users/:id',function (req, res, next) {
    userService.modifyData(req.id,function(result){
        res.json(result);
        res.end();
    });
});
router.delete('/users/:id',function (req, res, next) {
    userService.removeData(req.id,function(result){
        res.json(result);
        res.end();
    });
});



//base64保存为图片
router.post('/upload', function(req, res){
//接收前台POST过来的base64
    var imgData = req.body.imgData;
//过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/,"");
    var dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("image.png", dataBuffer, function(err) {
        if(err){
            res.send(err);
        }else{
            res.send("保存成功！");
        }
    });
});
