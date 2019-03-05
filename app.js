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
const passportSetup = require('./config/passport/passport-setup');



// ====================== Mongoose configuration
//mongoose.Promise = Promise;
//                        KEY 
//                         |
mongoose          
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// =========================== Middleware Setup
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


// =============== REGISTER THE PARTIALS:
hbs.registerPartials(__dirname + '/views/partials');

// =============== default value for title local
app.locals.title = 'MST-APP';





// ============= SESSION
//****** configure the middleware ****** */
//****** first of all we have to configure */
// ***  the express-session *****/
app.use(session({
  //secret key it will use to be generated
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

// =============== MUST COME AFTER THE SESSION
passportSetup(app);



// ========= ROUTES MIDDLEWARE


const index = require('./routes/index');
app.use('/', index);

app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/call-routes'));
app.use('/', require('./routes/admin-routes'));
     // another way to create the routes
//const callRoutes = require("./routes/call-routes");
//app.use('/' , callRoutes);
//const authRoutes = require("./routes/auth-routes");
//app.use('/' , authRoutes);

module.exports = app;
