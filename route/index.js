var express = require('express');
var Message = require('../modules/db/msg');
var showpage = require('../public/js/showpage').showpage;
var router = express.Router();
router.use(express.urlencoded({extended:false}));
router.use(require("../route/register"));

// 首页
router.get('/',(req,res)=>{
    var page = (req.query.page || 1) * 1;
    Message
    .find()
    .populate('author')
    .populate('reples')
    .exec((err,data)=>{ 
        // console.log(err);
        // console.log(data); 
        var msgs = JSON.parse(JSON.stringify(data));
        var error = req.flash('error').toString();
        msgs.reverse();
        showData = showpage(msgs,5,page);
        // console.log(msgs)
        Message.countDocuments(()=>{
            res.render('index',{
                msgs:showData.showData,
                page:showData.curPage,
                totalPage:showData.totalPage,
                user:req.session.user,
                error
            });
        });
        // console.log(error);
    });
});



module.exports = router;