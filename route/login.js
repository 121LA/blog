var express = require('express');
var User = require('../modules/db/user');
var router = express.Router();
var md5 = require('md5');

// 登录
router.get('/login',(req,res)=>{
    var error = req.flash('error').toString();
    res.render('login',{error});
});
router.post('/login',(req,res)=>{
    User.findOne({username:req.body.username},(err,user)=>{
        if (!user) {
            // res.send('用户名不存在');
            req.flash('error','用户名不存在');
            res.redirect('/login');
        } else {
            if (md5(req.body.password) == user.password) {
                // 每次登录时，在session对象中添加user，user会被自动的保存或者更新到session中
                req.session.user = user;

                res.redirect('/');
            } else {
                // res.send('密码错误');
                req.flash('error','密码错误');
                res.redirect('/login');
            }
        }
    });
});

// 编辑用户信息
router.get('/edit/userinfo',(req,res)=>{
    res.render('userinfo');
});
router.post('/edit/userinfo',(req,res)=>{
    res.send('xxx');
});
// 编辑用户头像
router.get('/edit/user/logout/:name',(req,res)=>{
    res.render('editheader');
})
// 退出登录
router.get('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;