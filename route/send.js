var express = require('express');
var Message = require('../modules/db/msg');
var router = express.Router();
var tools = require('../modules/tools');


router.get('/send',(req,res)=>{
    var error = req.flash('error').toString();
    res.render('send',{error});
});

// 发布
router.post('/send',(req,res)=>{
    if (!req.session.user) {
        req.flash('error','登录后才能发布消息');
        res.redirect('/login');
        return;
    }
    
    var msg = new Message({
        title:req.body.title,
        content:req.body.content,
        time:tools.dateFormat(new Date()),
        target:req.body.target,
        author:req.session.user._id,
        reples:[]
    });

    if(msg.target.length == 0){
        req.flash('error','至少输入一个标签');
        res.render('/send');
    } else{
        msg.save(err=>{
        res.redirect('/');
    });
    }
  
});



module.exports = router;