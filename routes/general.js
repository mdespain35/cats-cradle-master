const path = require('path');

const express = require('express');


const generalController = require('../controllers/general');
// import middleware to determine if user is logged in or not
// looks left to right
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', generalController.getIndex);

router.get('/games', generalController.getGames);

router.get('/cats', generalController.getCats);

router.get('/rooms', generalController.getRooms);

module.exports = router;
