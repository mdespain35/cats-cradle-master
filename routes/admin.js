const path = require('path');

const express = require('express');
//import body function from express validator
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
// import middleware to determine if user is logged in or not
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

// looks left to right
// first look to see if user is logged in, then look at admin controller

router.get('/add-cat', isAuth, isAdmin, adminController.getAddCat);                            // <--------- Come back and add isAuth to all of these

router.get('/add-game', isAuth, isAdmin, adminController.getAddGame);

router.get('/add-room', isAuth, isAdmin, adminController.getAddRoom);

router.post('/add-game', isAuth, isAdmin, adminController.postAddGame);

router.post('/add-room', isAuth, isAdmin, adminController.postAddRoom);

// validate the steps of adding a cat's name, image url, and description

router.post(
  '/add-cat',
  [
    body('name')
      .isString()
      .isLength({ min: 2})
      .trim(),
    body('description')
      .isLength({ min: 5, max: 400})
      .trim()
  ],
  isAuth,
  isAdmin,                                              
  adminController.postAddCat
);

// protect route through middleware to check if logged in or not

router.get('/edit-room/:roomId', isAuth, isAdmin, adminController.getEditRoom);

router.post('/edit-room', isAuth, isAdmin, adminController.postEditRoom);

router.get('/adopt/:catId', isAuth, adminController.getAdoption);

router.post(
  '/adopt',
  [
    body('name')
      .isString()
      .isLength({ min: 2})
      .trim(),
    body('reason')
      .isLength({ min: 5, max: 400})
      .trim()
  ],
  isAuth,                                             
  adminController.postAdoption
);

router.get('/add-appt/:roomId', isAuth, adminController.getAddAppt);

router.post('/add-appt', isAuth, adminController.postAddAppt);

// protect route through middleware to check if looged in or not

router.post('/delete-game', isAuth, isAdmin, adminController.postDeleteGame);


module.exports = router;
