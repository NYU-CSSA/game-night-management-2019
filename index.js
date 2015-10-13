var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('routes');
var session = require('express-session');
var sessionOptions = {
  secret: 'secret cookie thang',
  resave: true,
  saveUninitialized: true
};


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(session(sessionOptions));

// views is directory for all template files
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

routes(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
