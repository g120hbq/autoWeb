/**
 * Created by biqing.hu on 2015/12/16.
 */
 var router = require('express').Router();
 module.exports = router;

router.get('/editUser',function(req,res,next){
 res.render('user/editUser');
});
router.get('/',function(req,res,next){
 res.render('user/indexAAAAAAAAAAAAAA');
});

