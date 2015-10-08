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
			staffRef.once("value", function(snapshot) 
			{
  				if(snapshot.child("aj1533").child("role").val() === 'dealer')
 				{
 					console.log(snapshot.child("aj1533").child("role").val());
					res.render('pages/registration');
  				}
  				else if(snapshot.hasChild("role") && snapshot.child("role").val === "registration")
  				{
  					//res.render('pages/registration');
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
	var playNumber = req.body.playNo;
	console.log("Add 100");
	res.render('pages/success');
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


