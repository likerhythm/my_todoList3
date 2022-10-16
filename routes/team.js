const express = require('express');

const { User, Team } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

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



router.post('/join', isLoggedIn, async (req, res, next) => {
	try{
		// 로그인한 유저 id
		const userId = req.user.id;
		const teamId = req.body.teamId;
		const team = await Team.findOne({
			where: { id: teamId },
		});
		let users = [];
		// team에 가입 된 유저들
		users = await team.getUsers({attributes: ['id']});
		console.log('users:', users);
		// team의 생성자가 아니고 team에 가입되지 않은 경우
		if (team.UserId !== userId && !users.includes(userId)) {
			await team.addUser(userId);
		}
		res.redirect('/');
	} catch (error) {
		console.error(error);
		next(error);
	}
})

module.exports = router;