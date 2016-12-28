var express = require('express');
var path = require('path');
//处理收藏夹图标的
var favicon = require('serve-favicon');
//处理日志的
var logger = require('morgan');
//解析cookie的 req.cookie用来设置cookie req.cookies把请求中的cookie封装成对象
var cookieParser = require('cookie-parser');
//管理session
var session = require('express-session');
//解析请求体的 req.body
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var hbs = require('express-hbs');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var app = express();

// view engine setup
//partialsDir: 指定partial页面的目录
app.engine('hbs', hbs.express4({
	partialsDir: __dirname + '/views/partials'
}));
//设置模版的存放路径
app.set('views', path.join(__dirname, 'views'));
//设置模版引擎配置
app.set('view engine', 'hbs');
require('./utils/hbs-helper')(hbs);
//express.static 负责托管 Express 应用内的静态资源
app.use('/static',express.static(path.join(__dirname, 'static')));


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
//日志中间件
app.use(logger('dev'));
//解析json  请求体
app.use(bodyParser.json());
//解析application/x-www-form-urlencoded  请求体
app.use(bodyParser.urlencoded({ extended: false }));
//解析表单中二进制文件
app.use(multipart({uploadDir: __dirname + '/static/uploads'}));
//cookie
app.use(cookieParser());
//secret 作为服务器端生成session的签名
//resave:(是否允许)当客户端并行发送多个请求时，其中一个请求在另一个请求结束时对session进行修改覆盖并保存。
//初始化session时是否保存到存储。默认为true
app.use(session({secret: 'hello! EXPRESS',
	resave: true,
	saveUninitialized: true
}));


//初始化passport
//passport初始化
//引入passport的session。这样，被配置好的passport将会在用户请求到来时检查cookie并填充req.user对象；在用户登录成功后相应地设置cookie。
app.use(passport.initialize());
app.use(passport.session());


//设置strategy.当发生用户或密码错误时，callback使用done(null,false)。因为用户名或密码错误不代表是程序的错误，所以不抛出错误。
//这里为用户验证指定了使用用户名与密码进行验证（Basic）的验证策略。
// 当然，passport-local-mongoose还提供了其他的验证策略如：OAuth、Digest、Anonymous等。
passport.use('local',new LocalStrategy({
	usernameField:'name',
	passwordField:'pass'
},function (name,pass,done){
	User.findOne({ name: name }, function (err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		user.authenticate(pass,function(noIdea,result,err){
			if(!result)  return done(null, false);
			return done(null, user);
		})
	});
}));

// passport.use(User.createStrategy());
////上面这两个方法告诉passport如何将一个User对象序列化为cookie中的值，以及如何从cookie中的值反序列化生成User对象。
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect mongoose连接数据库
mongoose.connect('mongodb://localhost/blog', function(err) {
	if (err) {
		console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
	}
});
//用户信息中间件
app.use(function (req, res, next) {
	res.locals.user = req.user;
	next();
});

//处理路由 这里的/是一级目录
app.use('/',require('./routes/home'),require('./routes/account'));
app.use('/info',require('./routes/admin/index'));

//捕获404错误，并转发到错误中间件中去
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//错误处理
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});




module.exports = app;
