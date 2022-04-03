const fs = require('fs'); // core node package
const path = require('path');

const Games = require('../models/games');
const Cats = require('../models/cat');
const Rooms = require('../models/room');
const Appt = require('../models/appointment');


exports.getGames = (req, res, next) => {
  Games.find()
  .then(games => {
    console.log(games);
    res.render('general/games-list', {
      game: games,
      pageTitle: 'Game Selection',
      path: '/games'
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
}

exports.getCats = (req, res, next) => {
  const adoptable = isAdoptable(req);
    Cats.find()
    .then(kitties => {
      res.render('general/cats', {
        cats: kitties,
        adopt: adoptable,
        pageTitle: 'Available Cats',
        path: '/cats'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    });
};

exports.getRooms = (req, res, next) => {
  Rooms.find()
    .then(room => {
      res.render('general/rooms', {
        rooms: room,
        pageTitle: 'Rooms',
        path: '/rooms'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    });
};

exports.getIndex = (req, res, next) => {
  res.render('general/index', {
    pageTitle: 'Home Page',
    path: '/'
  });
}

// Helper function for cat adoption logic

const isAdoptable = (req) => {
  let adoptable = [];
  const today = new Date();
  if (req.session.isLoggedIn) {
    if (req.user.appointments.length > 0) {
      for (let i = 0; i < req.user.appointments.length; i++) {
        Appt.findById(req.user.appointments[i])
          .then(appt => {
            if (appt.date.getTime() < today.getTime()) {
              adoptable.push(appt.cat);
            }
          });
      }
    }
  }
  return adoptable;
};