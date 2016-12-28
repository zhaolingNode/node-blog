var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Comment = require('../models/comment');

router.get('/',function (req,res) {
	User.find({}, function (err, users) {
		if (err) return next(err);
		res.render('account/index', {
			users: users,
			title: '一个简单的博客'
		});
	});
});

router.get('/user/:id', function (req, res, next) {
	User.findById(req.params.id, function (err, author) {
		if (err || !author) return next(err);
		var cond = {author: req.params.id};
    var page = parseInt(req.query.page|| 1) ;
		Post.count(cond,function (err,count) {
			   var pages = Math.ceil(count/3);
			   if(page > pages){
			   	 var err = new Error('Not Found');
			   	 err.status = 404;
			   	 next(err);
			   	 return;
			   }
			Post.find(cond)
					.sort({_id: 1})
					.skip((page-1)*3)
					.limit(3)
					.exec(function (err, pager) {
						if (err) return next(err);
						res.render('home/user', {
							pager: pager,
							page: page,
							isFirstPage: page<=1?1:page-1,
							isLastPage: page>=pages?pages:page+1,
							title: author.name + ' 的首页',
							author: author
						});
					});
		});
	});
});

router.get('/postDetail/:id',function (req,res,next) {
	Post.findById(req.params.id)
			.populate('author comments')
			.exec(function (err, post) {
				if (err) return next(err);

				Comment.populate(post.comments, 'author');
				res.render('home/postDetal', {
					post: post,
					author: post.author,
					title: '编辑博文'
				});
			});
});

router.post('/postDetail/:id', function (req, res, next) {
	Post.findById(req.params.id, function (err, post) {
		if (err) return next(err);
		var comment = new Comment({author: req.user.id, content: req.body.content});
		comment.save(function (err, comment) {
			if (err) return next(err);

			post.comments.push(comment.id);
			post.save(function (err, post) {
				if (err) return next(err);
				res.send({author: req.user.name, content: comment.content});
			});
		});
	});
});

module.exports = router;
