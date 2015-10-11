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
		res.render('pages/error', {errortype : "not the same password"});
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
            res.render('pages/error', {errortype : "email taken!"});
        		break;
      		case "INVALID_EMAIL":
        		console.log("The specified email is not a valid email.");
        		res.render('pages/error', {errortype : "Invalid email"});
        		break;
      		default:
        		console.log("Error creating user:", error);
        		res.render('pages/error', {errortype : "not sure -v-"});
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
        res.render('pages/error', {errortype : "wrong Netid or pwd"});
	  } 
	  else 
	  {
      staffRef.once("value", function(snapshot){
        var myrole = snapshot.child(netid).child("role").val();
        if(myrole === 'dealer')
 				{
          console.log(snapshot.child(netid).child("role").val(), "render to operation");
          res.render('pages/operation');
  			}
  			else if(myrole === "registration")
  			{
  				console.log(snapshot.child(netid).child("role").val(), "render to registration");
          res.render('pages/registration');
  			}	
        else
  			{	
          console.log("no role, role = " + role);
  				res.render('pages/error', {errortype : "no role"});
  			}
      });
		}
	});
});

app.post('/registration', function(req,res){
	var uid = req.body.playNo;
  var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
  playerRef.once("value", function(snapshot){
    if(snapshot.hasChild(uid.toString()))
    {
      var tmp = snapshot.child(uid.toString()).child("chargeRemainTimes").val();
      if(tmp > 0){
        playerRef.child(uid.toString()).update({
          chargeRemainTimes : tmp - 1,
          chips : snapshot.child(uid.toString()).child("chips").val() + 100
        });
        console.log("Add 100, time--");
        console.log("chargeRemainTimes = " + snapshot.child(uid.toString()).child("chargeRemainTimes").val());
        res.render('pages/success');
      }
      else{
        console.log("chargeRemainTimes没啦!");
        res.render('pages/error', {errortype : "chargeRemainTimes没啦!"});
      }
    }
    else{
      playerRef.child(uid.toString()).update(
        {
          "chargeRemainTimes" : 3,
          "chips" : 100
        });
      console.log("Add 100(created)");
      res.render('pages/success');
    }
  });
});

// by Anna
// find a player in firebase when dealer assistant clicks 'find'
app.post('/findplayer', function(req, res) {
  var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
  var playerNumber = req.body.playernumber
  // TODO: varify that operater has logged in

  playerRef.once("value", function(snapshot) {
    if (snapshot.haschild(playNumber)) {

    } else {
      
    }
  });

}); 

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
