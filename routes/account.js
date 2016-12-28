var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var check = require('../middle/index');

router.get('/login',check.checkNotLogin, function(req, res) {
	res.render('account/login', {title:'登录'});
});
//调用callback passport.authenticate('local')，即调用了passport的local strategy进行验证
router.post('/login', passport.authenticate('local'),function (req,res) {
	req.session.authenticated = true;
  res.redirect('/');
});

router.get('/register',check.checkNotLogin,function (req,res) {
    res.render('account/register',{title:'注册'});
});
router.post('/register',function (req,res,next) {
        var name = req.body.name || '',
            pass = req.body.pass || '';
        if(name.length === 0 || pass.length === 0){
          return res.status(400).end('用户名或密码不合法');
        }
        //存储用户注册信息
        User.register(new User({name:req.body.name}),req.body.pass,function (err) {
          if(err){
	          return next(err);
          }
	        res.redirect('/login');
        });
});
router.get('/logout',check.checkLogin,function (req,res) {
   req.logout();
	 res.redirect('/');
})

module.exports = router;
