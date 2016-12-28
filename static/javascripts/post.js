$(function(){
	$('#content')
			.bind('input propertychange', function(){
				$('#preview').html(marked($('#content').val()));
			})
			.trigger('input');
});

//创建博客文章
function save() {
	if($('#post #title').val().trim()===''){
		$('.alert-danger').html('标题不能为空').show();
		return false;
	}
	if($('#post #content').val().trim()===''){
		$('.alert-danger').html('博客内容不能为空').show();
		return false;
	}
}

//删除博客文章
function deletePost(id) {
	$.ajax({
		url: '/info/post/' + id,
		type: 'DELETE',
		success: function (result) {
			location.reload();
		}
	});
}
