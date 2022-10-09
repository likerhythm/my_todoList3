const express = require('express');
const { Team } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', async (req, res, next) => {
  try {
    const teams = await Team.findAll({
    });
		res.render('main', {
		teams,
	});
  } catch (error) {
		console.error(error);
		next(error);
	}
  
});

router.get('/join', (req, res) => {
  res.render('join');
});

router.get('/createTeam', (req, res) => {
  res.render('createTeam');
});

router.get('/joinTeam', (req, res) => {
  res.render('joinTeam');
});

module.exports = router;