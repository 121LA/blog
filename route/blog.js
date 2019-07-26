var express = require('express');
var Message = require('../modules/db/msg');
var Reply = require('../modules/db/reply');
var showpage = require('../public/js/showpage').showpage;
var router = express.Router();
var tools = require('../modules/tools');


// 点击标题或者内容获得所有的博客详情
router.get('/detail/:id', (req, res) => {
    Message
    .findOne({ _id: req.params.id })
    .populate('author')
    .populate('reples')
    .exec((err, data) => {
        // console.log(data);
        var msgs = JSON.parse(JSON.stringify(data));
        Message
        .findOneAndUpdate({
            _id: req.params.id
        }, {
                pageviews: data.pageviews + 1,
            },{useFindAndModify:false} ,(err) => {
                if (err) return next(err)
                var blog = data;
                blog.pageviews++;
                res.render('detail', {
                    msgs,
                    user: req.session.user
                });
            });
    });
});

// 评论
router.post('/reply/:id', (req, res) => {
    var reply = new Reply({
        content: req.body.content,
        time: tools.dateFormat(new Date()),
        username: req.session.user.username,
    });
    reply.save(() => {
        Message.findOne({ _id: req.params.id }, (err, data) => {
            data.reples.push(reply.id);
            data.save(() => {
                res.redirect('/detail/' + req.params.id)
            });
        });
    });
});


// 编辑博客详情
router.get('/detail/:id/edit', (req, res) => {
    Message
    .findOne({ _id: req.params.id }, (err, data) => {
        var msgs = JSON.parse(JSON.stringify(data));
        if (msgs) {
            // console.log(msgs);
            res.render('edit', {
                msgs,
                user: req.session.user
            });
        }
    });
});
router.post('/detail/:id/edit', (req, res) => {
    Message
    .findOne({ _id: req.params.id }, (err, data) => {
        if (data) {
            data.title = req.body.title;
            data.target = req.body.target;
            data.content = req.body.content;
            data.user = req.session.user;
            data.time = tools.dateFormat(new Date());
            data.save(err => {
                if (err) return console.log(err.message);
                res.redirect('/');
            });
        }
    });
});

// 删除博客详情
router.get('/detail/:id/delete', (req, res) => {
    Message.findOneAndDelete({ _id: req.params.id }, (err, data) => {
        if (data) {
            res.redirect('/');
        }
    });
});

// 点击博客作者显示该用户的博客列表
router.get('/userblog', (req, res, next) => {
    var user = req.query.author;
    // console.log(user);
    var page = (req.query.page || 1) * 1;
    Message
    .find({ author: user })
    .populate('author')
    .exec((err, data) => {
        if (err) return next(err)
        var msg = JSON.parse(JSON.stringify(data))
        msg.reverse();
        showData = showpage(msg, 2, page);
        Message.countDocuments(() => {
            res.render('userblog', {
                user: req.session.user,
                msgs: showData.showData,
                page: showData.curPage,
                totalPage: showData.totalPage,
                author: req.params.user
            });
        });
    });
});

// 点击标签显示关于该标签的博客列表
router.get('/target/:tag', (req, res) => {
    Message
    .find({ target: req.params.tag })
    .populate('author')
    .exec((err, data) => {
        console.log(data);
        var msgs = JSON.parse(JSON.stringify(data));
        res.render('target', { msgs });
    });
});

// 根据标题搜索
router.get('/search', (req, res) => {
    Message
        .find({
            $or: [
                { title: { $regex: req.query.search, $options: '$i' } },
                { content: { $regex: req.query.search, $options: '$i' } }
            ]
        })
        .populate('author')
        .populate('reples')
        .exec((err, data) => {
            console.log(data);
            var msg = JSON.parse(JSON.stringify(data));
            var page = (req.query.page || 1) * 1;
            msg.reverse();
            showData = showpage(msg, 5, page);
            Message.countDocuments(() => {
                res.render('search', {
                    user: req.session.user,
                    msgs: showData.showData,
                    page: showData.curPage,
                    totalPage: showData.totalPage,
                });
            });
        });
});


// 点点滴滴
router.get('/history', (req, res, next) => {
    // 当天的页码
    var page = (req.query.page || 1) * 1;
    Message.find()
        .populate('author')
        .exec((err, data) => {
            var msgs = JSON.parse(JSON.stringify(data));
            showData = showpage(msgs, 5, page);
            data.forEach(item => { // 遍历数据对象的 tags 属性，将不重复且不为空串的值添加到 tags 中
                msgs.push()
            });
            Message.countDocuments(() => {
                res.render('history', {
                    msgs: showData.showData,
                    page: showData.curPage,
                    totalPage: showData.totalPage,
                    user: req.session.user
                });
            });

        })
})

// 渲染关于页面
router.get('/about', (req, res) => {
    res.render('about');
});

// 显示所有标签
router.get('/target', (req, res) => {
    var notes = [];
    Message
        .find()
        .exec((err, data) => {
            data.forEach((item) => {
                item.target.forEach(tag => {
                    notes.push(tag);
                });
            });
            var note = tools.notesFormat(notes);
            res.render('targetlist', {
                note,
                user: req.session.user
            });
        });
});


module.exports = router;