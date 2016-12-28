var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	content: {type: String, required: true},
	date: {type: Date, default:Date.now},
	author: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Comment', commentSchema);