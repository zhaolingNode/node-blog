/**
 * 注册
 */
function register() {
 if(!simpleValidate()){
	 return false;
 }

 var pass = $('[name=pass]').val();
 var password1 = $('#password1').val();
 if(pass != password1){
 	 warn('两次输入的密码不一致');
 	 return false;
 }
}
/*
 * 登录
 */
function login() {
	if(!simpleValidate()){
		return false;
	}
}
/*
 * 更改密码
 */
function updatePass(){
  if(!passValidate()){
	  return false;
  }

	$.ajax({
		url: '/info/password/',
		type: 'POST',
		data: $('#password .form').serialize(),
		dataType:'json',
		success: function (result) {
			if(result.code){
				warn(result.msg);
				return;
			}else{
				window.location.href = '/login';
			}
		}
	});


}

//前端校验更改密码
function passValidate() {
	var oldP = $('[name=old]').val();
	var newP = $('[name=new]').val();
	var repeat = $('[name=repeat]').val();
	if(oldP.length === 0){
		warn('原密码不能为空');
		return false;
	}
	if(newP.length === 0){
		warn('新密码不能为空');
		return false;
	}
	if(repeat.length === 0){
		warn('再次确认密码不能为空');
		return false;
	}
	if(newP != repeat){
		warn('两次输入的密码不一致');
		return false;
	}
	return true;
}
//前端校验
function simpleValidate() {
	 var name = $('[name=name]').val().trim();
	 var pass = $('[name=pass]').val();

  if(name.length === 0){
  	warn('邮件不能为空');
  	return false;
  }
	if(!validateEmail(name)){
		warn('邮件不合法');
		return false;
	}
	if(pass.length === 0){
		warn('密码不能为空');
		return false;
	}
	return true;
}
//错误提示
function warn(msg){
	$('.alert').hide();
	$('.alert-danger').html(msg).show();
}
//成功提示
function info(msg) {
	$('.alert').hide();
	$('.alert-success').html(msg).show();
}
//验证邮箱
function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}
