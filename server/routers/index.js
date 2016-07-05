/**
 * Created by biqing.hu on 2015/12/16.
 */
 var router = require('express').Router();
 module.exports = router;

router.get('/editUser',function(req,res,next){
 res.render('user/editUser');
});
router.get('/',function(req,res,next){
 res.render('user/indexAAAAAAAAAAAAAA',{name:'12333223'});
});



var fs=require('fs');
var path=require('path');
//base64保存为图片
router.get('/saveShareImage', function(req, res){
 var imgPath='/images/share/';
 //res.send(savePath+'/'+GLOBAL.moment().format("YYYYMMDDHHmmss"));
 res.render('user/indexAAAAAAAAAAAAAA',{imgUrl:imgPath+'1.jpg',url:'http://www.baidu.com'});
});
