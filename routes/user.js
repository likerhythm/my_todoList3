const express = require('express');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
	// 전역변수 마냥 많이 쓰이는 변수는 맨 위 미들웨어에서 
	// 아래 처럼 정의 해놓으면 편함
	res.locals.user = req.user;
	next();
});

router.get('/profile', isLoggedIn, (req, res, next) => {
	res.render('/userProfile', {
	});
});

module.exports = router;