//必须登录后才能访问
exports.checkLogin = function (req,res,next) {
    if(req.user){
        next();
    }else{
        res.redirect('/login');
    }
};

//必须未登录才能访问
exports.checkNotLogin = function (req,res,next) {
    if(req.user){
        res.redirect('/');
    }else{
        next();
    }
};