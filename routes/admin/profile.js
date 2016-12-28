var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../../models/user.js');
var check = require('../../middle/index');
var fs = require('fs');

/* GET users listing. */
router.get('/',check.checkLogin, function(req, res) {
  res.render('admin/profile',{title:'博客中心',active_profile:true});
});

router.post('/',function (req,res) {
	req.user.title = req.body.title;
	req.user.description = req.body.description;
	if(req.files.avatar) {
		if (req.files.avatar.originalFilename) {
			req.user.avatar = '/uploads/' + path.basename(req.files.avatar.path);
		}
		else {
			fs.unlink(req.files.avatar.path, function (err) {
				console.error('tmp file unlink failed:', err);
			});
		}
	}

	req.user.save(function (err, user) {
		if (err) next(err);
		res.render('admin/profile', {title:'个人中心',user: user,active_profile:true});
	});
})

module.exports = router;
