const express = require('express');

const { User, Team } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// 팀 목록 보여주기
router.get('/', isLoggedIn, (req, res, next) => {

});

// 팀 생성하기
router.post('/create', isLoggedIn, async(req, res, next) => {
	try {
		const team = await Team.create({
			name: req.body.teamName,
			topic: req.body.topic,
			UserId: req.user.id,
		});
		res.redirect('/');
	} catch (error) {
		console.error(error);
		next(error);
	}
});

router.post('/profile', isLoggedIn, async(req, res, next) => {
	try {
		const team = await Team.findOne({
			where: { name: req.body.teamName },
			attributes: ['name'],
		});
		res.render('profile', {
			team,
		})
	} catch (error) {
		console.error(error);
		next(error);
	}
})

router.post('/join', isLoggedIn, )

module.exports = router;