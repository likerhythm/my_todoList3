const express = require('express');
const { Team, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      include: {
        model: User,
        attributes: ['nick'],
      },
    });
		res.render('main', {
		teams,
	});
  } catch (error) {
		console.error(error);
		next(error);
	}
  
});

router.get('/userProfile', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['nick'],
    });
    res.render('userProfile', {
      user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join');
});

router.get('/createTeam', isLoggedIn, (req, res) => {
  res.render('createTeam');
});

  // 팀 가입하기
router.get('/joinTeam', isLoggedIn, async(req, res, next) => {
	try {
		const teams = await Team.findAll({
			attributes: ['name', 'topic', 'progressRate'],
		});
    console.log('teams: ', teams);
		res.render('joinTeam', {
			teams,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;