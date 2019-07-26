var express = require('express');
var User = require('../modules/db/user');
var router = express.Router();
var md5 = require('md5');

// 注册
router.get('/register',(req,res)=>{
    // console.log(req.flash('error').toString());
    // 从flash暂存器中取出 error 的值
    var error = req.flash('error').toString();
    res.render('register',{error});
});
router.post('/register',(req,res)=>{
    User.findOne({username:req.body.username},(err,data)=>{
        if (data) {
            // 在flash暂存器中添加一个 error 信息
            req.flash('error','用户名已被抢注');
            res.redirect('/register');
        } else {
            if(req.body.password != req.body.repassword){
                req.flash('error','两次密码不一致');
                res.redirect('/register');
            } else{
                // 对密码进行MD5加密
                req.body.password = md5(req.body.password);
                req.body.repassword = md5(req.body.repassword);
                var userObj = Object.assign(req.body,{
                    headerurl:'/imgs/timg.jpg',
                });
                var user = new User(userObj);
                user.save(err=>{
                    res.redirect('/login');
                });
            }
        }
    });
});

module.exports = router;