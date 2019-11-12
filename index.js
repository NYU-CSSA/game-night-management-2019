// set up ======================================================================
// get all the tools we need

var express  = require('express');
var app      = express();
var port     = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var cors = require('cors');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

require('dotenv').config();

app.use(flash()); // use connect-flash for flash messages stored in session
require('./config/passport')(passport); // pass passport for configuration

//=============================================================
/**
 * Database connection
 */
const dbURI = process.env.ATLAS_URI

mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true }, function (error) {
    //Errors here
    // console.log(error);
});

mongoose.connection.once('open', () => {
    console.log("MongoDB database connection suceeded");
});

// set up our express application
app.use(cors());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));  // TODO: why use static here
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs'); // set up ejs for templating
app.use(function(req, res, next) { res.header('Access-Control-Allow-Origin', "*"); res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); res.header('Access-Control-Allow-Headers', 'Content-Type'); next(); })

// required for passport
app.use(session({ secret: 'jeremylovesanna' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
