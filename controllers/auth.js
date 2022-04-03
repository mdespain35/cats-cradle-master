const crypto = require('crypto'); // library that creates unique secure random value

const bcrypt = require('bcryptjs');
// import with destructor vlidation Result function to gather all errors
const { validationResult } = require('express-validator');

const User = require('../models/user');
// using connect flash display error message

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  // if there is a message then retrieve it and flash on screen
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    // set fields to empty when page launches
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
    // if there is a message then retrieve it and flash on screen
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
  // retrieve information from the request body
  const email = req.body.email;
  const password = req.body.password;
  // construct error validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      // flash message 
      errorMessage: errors.array()[0].msg, // display first error of error array
     // save user input for better user experience
     oldInput: {
      email: email,
      password: password
    },
    validationErrors: errors.array() // return full array of errors
    });
  }
// look at email field and see if value matches
User.findOne({ email: email })
.then(user => {
  if (!user) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: 'Invalid email address.',
          // keep the user input for better user experience
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: [{param: 'email', param: 'password'}]
        });
      }
      // using bcrypt algorithm checked hashed password using bcrypt compare
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // save the session to ensure no timing issue for redirect
            // redirect is fired independent of session being saved to mogo
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid password.',
                // keep the user input for better user experience
                oldInput: {
                  email: email,
                  password: password
                },
                validationErrors: [{param: 'email', param: 'password'}]
              });
            })
            .catch(err => {
              console.log(err);
              res.redirect('/login');
            });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};
// retrieve email password and confirmed password after validation
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
// validate the user imput and collect errors into errors object
const errors = validationResult(req);
  // call if empty method - true or false
  if (!errors.isEmpty()) {
    console.log(errors.array()); // see errors in console log
    // if not empty indicate validation failed with status 422
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg, // ouput first error array of errors
          // keep the user input for better user experience
          oldInput: {
            email: email,
            password: password,
            confirmPassword: req.body.confirmPassword
          },
          validationErrors: [{param: 'email', param: 'password', param: 'confirmPassword'}]
        });
      }

      bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
      // construct new user and store email, password
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      // save in database
      return user.save();
    })
    // function following save to database redirects to login
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

