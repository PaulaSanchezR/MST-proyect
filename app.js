require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require('express-session');
const bcrypt     = require('bcryptjs');
const passport     = require('passport');
const LocalStrategy     = require('passport-local').Strategy;


const User = require("./models/user");




// Mongoose configuration
mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/mst-proyect', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

/*app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));*/
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'MST-APP';



const index = require('./routes/index');
app.use('/', index);

const authRoutes = require("./routes/auth-routes");
app.use('/' , authRoutes);


const callRoutes = require("./routes/call-routes");
app.use('/' , callRoutes);



//****** configure the middleware ****** */
//****** first of all we have to configure */
// *** the express-session *****/
app.use(session({
  //secret key it will use to be generated
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


//three methods that passport needs to work. these methods 
//the Strategy this include error control
passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

//****************************************************** */
//********initialize passport and passport session******** */
//******************************************************** */
app.use(passport.initialize());
app.use(passport.session());






module.exports = app;
