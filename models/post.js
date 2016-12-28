var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: {type: String, default: ''},
	content: String,
	author: {type: String, ref: 'User'},
	comments: [{type:String,ref: 'Comment'}],
	date: {type: Date, default:Date.now}
});

module.exports = mongoose.model('Post', PostSchema);
