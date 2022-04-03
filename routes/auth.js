const express = require('express');
// import by destructuring check and body function for express validator
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user'); // import user model

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  // check values in the body of the request
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 5 })
      .isAlphanumeric() // only allow alpha numeric password
      .withMessage('Please enter a password of at least 5 characters that is alpha numeric.')
      .trim()
  ],
  authController.postLogin
);

router.post(
  '/signup',
      // add middleware validator check function and create an array of validations
  [

    check('email')
      .isEmail() // built in method to check email field has valid address
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // find the user with the email address if a match
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            // throw an error inside of promise to state email exists asnchy validation
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      // check if email format is a standard format built in sanitizer
      .normalizeEmail(),
    body(
      'password',
      'Please enter a password of at least 5 characters that is alpha numeric.'
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      // remove excess white space with trim built in sanitizer
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match! Please re-enter.');
        }
        return true;
      })
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

module.exports = router;
