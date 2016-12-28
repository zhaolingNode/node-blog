var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = new Schema({
	name: {type:String,index:{unique:true}},
	pass:String,
	avatar:{
		type:String,
		default:''
	},
	title:{
		type:String,
		default:'未命名博客'
	},
	description:{
		type:String,
		default:'博主很懒，还没有添加任何描述……'
	}
});
//给UserSchema添加了一个插件，使得User的Modle拥有了一些有关验证和加密的方法。
UserSchema.plugin(passportLocalMongoose,{usernameField:'name'});
module.exports = mongoose.model('User',UserSchema);
