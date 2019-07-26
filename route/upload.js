var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var multer = require('multer');

var User = require('../modules/db/user');

/**
 * 文件操作的路径最好用 path 模块下的 path.join(__dirname) 方法拼接成一个绝对路径，
 * 因为如果是相对路径，相对的是执行 node app 命令所在的文件目录，这样在一些情况下可能就会出现问题
 * 
 * 
 */

var uploadpath = path.join(__dirname, '../public/imgs');
// console.log(uploadpath) // C:\Users\admin\Desktop\boke\public\imgs
var headername;

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,uploadpath);
    },
    filename:function(req,file,cb){
        var arr = file.originalname.split('.');
        var ext = arr[arr.length-1];
        headername = req.session.user.username+'-'+ Date.now()+'.'+ext;
        cb(null,headername);
    }
});

var upload = multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null,true);
        } else {
            cb('只能上传图片',false);
        }
    }
});

router.post('/upload/header',upload.single('headerimg'),(req,res)=>{
    var headerurl = '/imgs/'+headername;

    // uploadpath = 'C:\Users\admin\Desktop\boke\public\imgs'
    //  headername = '张三-1563802884113.jpg'
    if(fs.existsSync(path.join(uploadpath, headername))){
        User.findOne({_id:req.session.user._id},(err,user)=>{
            if(user.headerurl != '/imgs/timg.jpg'){
                fs.unlinkSync(path.join(__dirname, '../public', req.session.user.headerurl));
            }

            console.log(headerurl);
            
            user.headerurl = headerurl;
            user.save(()=>{
                req.session.user.headerurl = headerurl;
                res.redirect('/');
            });
        });
    } else {
        res.send('上传失败');
    }
});

module.exports = router;