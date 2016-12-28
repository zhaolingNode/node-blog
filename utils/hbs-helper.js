var hbs = require('express-hbs');

module.exports = function(hbs) {
	hbs.registerHelper('detailDate', function(date, block) {
		return dateFormat(date, 'yyyy-MM-dd hh:mm:ss');
	});
};

function dateFormat(datetime, format) {
	var date = {
		"M+": datetime.getMonth() + 1,
		"d+": datetime.getDate(),
		"h+": datetime.getHours(),
		"m+": datetime.getMinutes(),
		"s+": datetime.getSeconds(),
		"q+": Math.floor((datetime.getMonth() + 3) / 3),
		"S+": datetime.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
					date[k] :
					("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}