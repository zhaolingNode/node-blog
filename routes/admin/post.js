var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../../models/user.js');
var Post = require('../../models/post.js');
var check = require('../../middle/index');
require('mongoose-query-paginate');

router.route('/').get(check.checkLogin,function (req, res, next) {
			Post.find({author: req.user.id}, function(err, posts){
				if(err) return next(err);
				var cond = {author: req.user.id};
				var page = parseInt(req.query.page|| 1) ;
				Post.count(cond,function (err,count) {
					var pages = Math.ceil(count/3);
					if(pages && page > pages){
						var err = new Error('Not Found');
						err.status = 404;
						next(err);
						return;
					}
					Post.find(cond)
							.sort({_id: -1})
							.skip((page-1)*3)
							.limit(3)
							.exec(function (err, posts) {
								if (err) return next(err);
								res.render('admin/posts', {
									active_post: true,
									posts:posts,
									page: page,
									isFirstPage: page<=1?1:page-1,
									isLastPage: page>=pages?pages:page+1,
									title: '管理博客'
								});
							});
				});
			});
		});

router.route('/new').get(check.checkLogin,function (req, res) {
			res.render('admin/post',{id: 'new', title: '编辑博文', active_post: true});
		}).post(function (req, res, next) {
			Post.create({
				title: req.body.title,
				content: req.body.content,
				author: req.user.id
			}, function (err, post) {
				if (err) return next(err);
				else return res.redirect('/info/post');
			});
		});

router.route('/:id')
		.get(check.checkLogin,function(req, res) {
			Post.findById(req.params.id, function(err, post) {
				if (err || !post) next(err);
				 return res.render('admin/post', {post: post, id: post.id, title: '编辑博文', active_post: true});
			});
		})
		.post(function(req, res) {
			Post.findByIdAndUpdate(req.params.id, {
						title  : req.body.title,
						content: req.body.content
					},
					function(err, post) {
						if (err) return next(err);
						return res.redirect('/info/post');
					});
		})
		.delete(function(req, res, next) {
			Post.findByIdAndRemove(req.params.id, function(err, rows) {
				if (err) return next(err);
				res.end();
			});
		});

module.exports = router;
