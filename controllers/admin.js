const mongoose = require('mongoose');
//import validation function
const { validationResult } = require('express-validator');


// Required Schemas Import Section
const Cat = require('../models/cat');
const Game = require('../models/games');
const Room = require('../models/room');
const Appt = require('../models/appointment');
const Adopt = require('../models/adoption');

exports.getAddCat = (req, res, next) => {
  res.render('admin/edit-cat', {
    pageTitle: 'Add Cat',
    path: '/admin/add-cat',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
}

exports.postAddCat = (req, res, next) => {
  const name = req.body.name;
  const image = req.file;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-cat', {
      pageTitle: 'Add Cat',
      path: '/admin/add-cat',
      editing: false,
      hasError: true,
      cat: {
        name: name,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-cat', {
      pageTitle: 'Add Cat',
      path: '/admin/add-cat',
      editing: false,
      hasError: true,
      cat: {
        name: name,
        imageUrl: imageUrl,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const imageUrl = image.path;

  const cat = new Cat({
    name: name,
    description: description,
    imageUrl: imageUrl,
  });
  cat
    .save() // save defined by mongoose
    .then(result => {
      console.log('Check if Added Cat');
      res.redirect('/cats');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddRoom = (req, res, next) => {
  res.render('admin/edit-room', {
    pageTitle: 'Edit Room',
    path: '/admin/add-room',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
}

exports.postAddRoom = (req, res, next) => {
  const name = req.body.name;
  const image = req.file;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/edit-room', {
      pageTitle: 'Edit Room',
      path: '/admin/add-room',
      editing: false,
      hasError: true,
      room: {
        name: name,
        description: description
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-room', {
      pageTitle: 'Edit Room',
      path: '/admin/add-room',
      editing: false,
      hasError: true,
      cat: {
        name: name,
        imageUrl: imageUrl,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const imageUrl = image.path;

  const room = new Room({
    name: name,
    description: description,
    imageUrl: imageUrl,
  });
  room
    .save() // save defined by mongoose
    .then(result => {
      console.log('Check if Added Room');
      res.redirect('/cats');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getAddGame = (req, res, next) => {
  Game.find()
  .then(games => {
    res.render('admin/edit-game', {
      game: games,
      pageTitle: 'Modify Inventory',
      path: '/admin/add-game',
      editing: false,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postAddGame = (req, res, next) => {
  const title = req.body.title;
  const thumbnail = req.body.thumbnail;
  const full = req.body.full;
  const description = req.body.description;
  const purchaseUrl = req.body.purchase;

  const game = new Game({
    title: title,
    description: description,
    imageUrl: {
      thumbnail: thumbnail,
      full: full
    },
    purchaseUrl: purchaseUrl
  });

  game
    .save() // save defined by mongoose
    .then(result => {
      console.log('Check if Added Game to Inventory');
      res.redirect('/admin/add-game');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteGame = (req, res, next) => {
  const gameId = req.body.gameId;
  // check to see is user created the product to authorize if they can delete
  Game.deleteOne({ _id: gameId })
    .then(() => {
      console.log('Game Removed from Inventory');
      res.redirect('/admin/add-game');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getAddAppt = (req, res, next) => {
  const roomId = req.params.roomId;

  Room.findById(roomId)
    .then(room => {
      Cat.find()
      .then(cats => {
        Game.find()
        .then(games => {
          res.render('admin/add-appt', {
            pageTitle: 'Make Appointment',
            path: '/admin/add-appt',
            editing: false,
            room: room,
            cats: cats,
            games: games,
            hasError: false,
            errorMessage: null,
            validationErrors: []
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddAppt = (req, res, next) => {
  const roomId = req.body.roomId;
  console.log(req.body.day);
  const dateString = Date.parse(req.body.day + 'T' + req.body.time + ':00');
  const date = new Date(dateString);

  const catId = req.body.cat;
  const gameId = req.body.game;

  Room.findById(roomId)
    .then(room => {
      Cat.findById(catId)
      .then(cat => {
        Game.findById(gameId)
        .then(game => {
          const appt = new Appt({
            date: date,
            user: req.user,
            cat: cat,
            room: room,
            game: game
          });

          appt.save()
          .then(result => {
            req.user.addAppointment(appt);
            console.log('Check if Created Appointment');
            res.redirect('/rooms');
          })
          .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });  
}

exports.getEditRoom = (req, res, next) => {
  // const editMode = req.query.edit;
  // if (!editMode) {
  //   return res.redirect('/');
  // }
  const roomId = req.params.roomId;
  Room.findById(roomId)
    .then(room => {
      if (!room) {
        return res.redirect('/');
      }
      res.render('admin/edit-room', {
        pageTitle: 'Edit Room',
        path: '/admin/edit-room',
        editing: true,
        room: room,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditRoom = (req, res, next) => {
  const roomId = req.body.roomId;
  const updatedName = req.body.name;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
// check if any validation errors
if (!errors.isEmpty()) {
  return res.status(422).render('admin/edit-room', {
    pageTitle: 'Edit Room',
    path: '/admin/edit-room',
    editing: true,
    hasError: true,
    product: {
      name: updatedName,
      description: updatedDesc,
      _id: roomId
    },
    errorMessage: errors.array()[0].msg,
    validationErrors: errors.array()
  });
}

Room.findById(roomId)
.then(room => {
      // check to see if the user created the product to authorize if they can edit
      // convert to string for type equality
      room.name = updatedName;
      room.description = updatedDesc;
      if (image) {
        room.imageUrl = image.path;
      }    
      return room.save().then(result => {
        console.log('Updated Room!');
        res.redirect('/rooms');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAdoption = (req, res, next) => {
  const catId = req.params.catId;

  Cat.findById(catId)
    .then(cat => {
      res.render('admin/adopt-form', {
        pageTitle: 'Adoption Application',
        path: '/admin/adopt',
        editing: false,
        cat: cat,
        user: req.user,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAdoption = (req, res, next) => {
  const catId = req.body.catId;
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;
  const zip = req.body.zip;
  const reason = req.body.reason;

  const errors = validationResult(req);

  Cat.findById(catId)
  .then(cat => {
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render(`admin/adopt/${catId}`, {
        pageTitle: 'Adoption Application',
        path: '/admin/adopt',
        editing: false,
        hasError: true,
        cat: cat,
        adopt: {
          name: name,
          reason: reason
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
      });
    }
  
    const adopt = new Adopt({
      email: req.user.email,
      name: name,
      streetAddress: address,
      city: city,
      zipCode: zip,
      reason: reason,
      user: req.user,
      cat: cat
    });
    adopt
      .save() // save defined by mongoose
      .then(result => {
        console.log('Check if Added Application');
        res.redirect('/cats');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  })

}