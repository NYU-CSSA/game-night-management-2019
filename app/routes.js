
var Player = require("./models/player");

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
      res.render('pages/index',{loggedin:req.isAuthenticated()}); 
  });

  app.get('/login', function(req, res) {
    res.render('pages/login',{message : req.flash('signupMessage'),loggedin:req.isAuthenticated()});
  });

  app.get('/signup', function(req, res) {
    res.render('pages/signup', {message : req.flash('signupMessage'),loggedin:req.isAuthenticated()});
  });

  app.get('/registration',isLoggedIn,function(req,res){
    console.log("Authenticated user with uid:", authData.uid);
    var op = req.query.op;
    var uid = req.query.uid;
    if (!op || !uid) {
      res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: null});
    } else {
      var message = null;
      if (op == "add") {
        message = "added 100 for player " + uid;
      } else if (op == "create") {
        message = "created player " + uid;
      }
      res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: message}); 
    }
  });

  app.post('/registration',isLoggedIn,function(req,res){
    
  });

  app.get('/operation',isLoggedIn,function(req,res){
    var playerid = req.query.playerNum;
    if (playerid) {
      Player.findOne({'playerNum':playerid},function(err,user){
        if (err) {
          console.log(err);
          return;
        }
        if (user) {
          res.render('pages/operation',{
              player:user,
              playerNum:user.playerNum,
              chips:user.chips,
              refillsLeft:user.refillsLeft,
              tournamentsLeft : user.tournamentsLeft,
              loggedin:isLoggedIn()
          });
        } else {
          res.render('pages/operation',{player:null,loggedin:req.isAuthenticated()});
        }
      });
    } else {
      res.render('pages/operation',{player:null,loggedin:req.isAuthenticated()});
    }
  })

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/login', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/operation', // redirect to the secure profile section
      failureRedirect : '/', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}