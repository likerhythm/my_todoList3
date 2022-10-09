exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log('로그인 확인 완료');
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()){
        next();
    } else {
        const message = encodeURIComponent('로그인 한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};