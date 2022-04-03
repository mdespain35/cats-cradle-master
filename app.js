// All required third party and node modules
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf"); // cross site request forgery protection
const flash = require("connect-flash"); // import
const cors = require("cors");
const multer = require("multer"); // use middleware for image upload
require('dotenv').config();

const errorController = require("./controllers/error");
const User = require("./models/user");

// all application to run on Heroku or localhost:5000
const PORT = process.env.PORT || 5000;

// connect to Mongo Database
const MONGODB_URI = 'mongodb+srv://Player2:DRY719qIrnhUEU3s@cluster0.fbsbe.mongodb.net/diningIn?retryWrites=true&w=majority';

const app = express();
// add another collection call sessions
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf(); // use default settings

// create file storage for images
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  }, // name the image with the date and it's file name
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString + "-" + file.originalname);
  },
});

// types of valid images to upload
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/PNG" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/JPG" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/JPEG"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const corsOptions = {
  origin: "https://infinite-hamlet-66134.herokuapp.com/",
  optionsSuccessStatus: 200,
};

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  family: 4,
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const generalRoutes = require("./routes/general");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
// statically serve public and images folder
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(cors(corsOptions));
// set session to only save if something changed could set cookie age
app.use(
  session({
    secret: "wizard",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// create mongoose user model based on data stored in session
// if no user is logged in cannot add to cart');
// use session data - data the percists across requests with help of mongose model

// place before routes
//after initialize the session enable CSRF protection and connect flash
app.use(csrfProtection);
app.use(flash()); // call flash as function to use in app
// local variables passed into the views rendered verifies authentication and token
// passes is authenticated and CSRF token into all views

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.adminAccess = req.session.user.adminPriveleges;
  res.locals.csrfToken = req.csrfToken();
  next();
});
// above must be before routes

app.use((req, res, next) => {
  if (!req.session.user) {
    res.locals.adminAccess = false;
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        res.locals.adminAccess = false;
        return next();
      }
      req.user = user;
      res.locals.adminAccess = req.user.adminPriveleges;
      next();
    })
    .catch((err) => {
      next(new Error(err)); // inside asynch need next error
    });
});

app.use("/admin", adminRoutes);
app.use(generalRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
  console.log(error);
});

mongoose
  .connect(MONGODB_URI, options)
  .then((result) => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

