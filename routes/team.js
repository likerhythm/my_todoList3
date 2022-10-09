const express = require('express');
const { User, Team } = require('../models');

const router = express.Router();

// 팀 목록 보여주기
router.get('/', (req, res, next) => {

});

// 팀 생성하기
router.post('/create', async(req, res, next) => {
	try {
		const team = await Team.create({
			name: req.body.teamName,
			topic: req.body.topic,
		});
		res.redirect('/');
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 팀 가입하기
router.get('/join',(req, res, next) => {

});

module.exports = router;