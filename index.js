var express = require('express');
var app = express();
var Firebase = require('firebase');
var bodyParser = require('body-parser');


app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/login', function(request, response) {
	response.render('pages/login');
});

app.get('/signup', function(request, response) {
	response.render('pages/signup');
});

app.post('/signup', function(req, res) {
	if (req.body.password != req.body.crnfrmpassword) {
		onsole.log("not the same password");
		res.render('pages/signup');
		return;
	}
	var ref = new Firebase("https://ilovemarshmellow.firebaseio.com/");
	ref.createUser({
  		email: req.body.netid + "@nyu.edu",
  		password: req.body.password + ""
	}, function(error, userData) {
  	if (error) {
    	switch (error.code) {
      		case "EMAIL_TAKEN":
        		console.log("The new user account cannot be created because the email is already in use.");
        		res.render('pages/signup');
        		break;
      		case "INVALID_EMAIL":
        		console.log("The specified email is not a valid email.");
        		res.render('pages/signup');
        		break;
      		default:
        		console.log("Error creating user:", error);
        		res.render('pages/signup');
    	}
    } else {
    	console.log("Successfully created user account with uid:", userData.uid);
    	res.render('pages/login');
  	}
});
});
app.post('/login', function(req, res) {
	var staffRef = new Firebase("https://ilovemarshmellow.firebaseio.com/staff");
	var netid = req.body.netid;
	console.log(netid + "@nyu.edu");
	staffRef.authWithPassword({
	  email    : netid + "@nyu.edu",
	  password : req.body.password + ""
	}, function(error, authData) {
		console.log("hey");
		if (error) 
		{
	  		res.render('pages/login');
	    	console.log("Login Failed!", error);
	  } 
	  else 
	  {
      staffRef.once("value", function(snapshot){
        if(snapshot.child(netid).child("role").val() === 'dealer')
 				{
          console.log(snapshot.child(netid).child("role").val(), "render to operation");
          res.render('pages/operation');
  			}
  			else if(snapshot.hasChild("role") && snapshot.child("role").val === "registration")
  			{
  				console.log(snapshot.child(netid).child("role").val(), "render to registration");
          res.render('pages/registration');
  			}	
        else
  			{	
  					//res.render('pages/error');
  			}
      });
		}
	});
});

app.post('/registration', function(req,res){
	var uid = req.body.playNo;
  var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
  playerRef.child(uid.toString()).update(
  {
      "chargeRemainTimes" : 3,
      "chips" : 100
  });
  console.log("Add 100");
	res.render('pages/success');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
