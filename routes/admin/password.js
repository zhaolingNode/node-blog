var express = require('express');
var passport = require('passport');
var User = require('../../models/user.js');
var Post = require('../../models/post.js');
var router = express.Router();
var check = require('../../middle/index');
router.route('/')
		.get(check.checkLogin,function (req, res) {
			res.render('admin/password', {active_password: true, title: '更改密码'});
		})
		.post(function (req, res) {
			//这里简单，如果req.user不存在说明没登录，重定向到登录页
			if (!req.user) {
				return res.redirect('/login');
			}
			var oldP = req.body.old || '';//客户端输入的旧密码
			var newP = req.body.new || '';//客户端输入的新密码
			//这里进行验证，这个回调函数的第一个参数是null，不知道为什么要这个参有什么用
			req.user.authenticate(oldP, function (noIdea,isPwdcorrect,err) {
				if (!isPwdcorrect) {
					console.log(err);
					//控制台的错误输出，可以看到是“IncorrectPasswordError”：
					/*{ [IncorrectPasswordError: Password or username are incorrect]
					 name: 'IncorrectPasswordError',
					 message: 'Password or username are incorrect' }
					 */
					var result = JSON.stringify({code:1,msg:'旧密码输入错误！'});

					return res.status(200).end(result);
				}else{
					console.log("密码验证通过");
				}
			});
			//修改密码
			req.user.setPassword(newP, function (err) {
				if (err) {
					console.log(err);
					next(err);
				} else {
					req.user.save(function (err) {
						if (err) {
							console.log(err);
						}
						req.logout();
						return res.status(200).end(JSON.stringify({code:0,msg:''}));
					});
				}
			});

		});


module.exports = router;
