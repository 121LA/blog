var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static('public'));
app.engine('html',require('express-art-template'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));

var artTmpEngine = require('./modules/art-tem-config');
artTmpEngine(app);

var flash = require('connect-flash');
app.use(flash());

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    //添加session的配置信息
    secret:'mylogin',
    resave:true,
    saveUninitialized:true,
    rolling:true,
    cookie:{
        maxAge:1000*60*60
    },
    store: new MongoStore({
        // 连接数据库
        url:'mongodb://127.0.0.1/selfblog'
    })
}));

//设置模板渲染的变量
app.use(function(req,res,next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    next();
});

app.use(require("./route/index"));
app.use(require("./route/login"));
app.use(require("./route/register"));
app.use(require("./route/send"));
app.use(require("./route/blog"));
app.use(require("./route/upload"));




app.listen(3000,()=>{
    console.log('node running');
});

