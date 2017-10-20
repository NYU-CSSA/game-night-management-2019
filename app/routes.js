var Player = require("./models/player");
var tournamentAmount = 0;

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
      res.render('pages/index',{loggedin:req.isAuthenticated()}); 
  });

  app.get('/login', function(req, res) {
    res.render('pages/login',{message : req.flash('signupMessage'),loggedin:req.isAuthenticated()});
  });

  app.get('/signup',isLoggedIn,function(req, res) {
    res.render('pages/signup', {message : req.flash('signupMessage'),loggedin:req.isAuthenticated()});
  });

  app.get('/signout',isLoggedIn,function(req,res){
    req.logout();
    res.redirect('/');
  });


  app.get('/registration',isLoggedIn,function(req,res){
    var op = req.query.op; // op is the button of Creat/Add
    var uid = req.query.uid; // uid is the input ID
    if (!op || !uid) {
      res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: null});
    } else {
      var message = null;
      if (op == "add") {
        message = "added 500 for player " + uid;
      } else if (op == "create") {
        message = "created player " + uid;
      }
      res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: message})
    }
  });

  app.get('/topplayers',function(req,res){
    console.log("querying topplayers");
    Player.find({}).exec(function(err,players){
      if (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
      res.status(200).send(JSON.stringify(players) || {});
    });
  })

  app.post('/registration',isLoggedIn,function(req,res){
    var uid = req.body.playNo;
    if (uid) {
      Player.findOne({'playerNum':uid},function(err,user){
        if (err) {
          console.log(err);
          return;
        }
          //Successfully created user 15, No player number
          //Successfully added 500 chips to user 10
          //This user got no refills left.

        if (user) {
          // update an existing user
          if (user.refillsLeft > 0) {
            Player.update({'playerNum':uid},{$inc:{'chips':500,'refillsLeft':-1}},{},function(err,user){
              if (err) {
                return res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: "Error adding chips"});
              }
              res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: "Successfully added 500 chips to user " + uid});
            });
          } else {
            res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: "This user got no refill left."});
          }
        } else {
          // create a user
          var player = new Player();
          player.playerNum = uid;
          player.save(function(err){
            if (err) {
              throw err;
            }
            res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: "Successfully created user " + uid});
          });
        }
      });
    } else {
      res.render('pages/registration', {loggedin : req.isAuthenticated(), msg: "No player number"});
    }
  });

  app.get('/operation',isLoggedIn,function(req,res){
    var playerid = req.query.playerNum;
    console.log(playerid);
    if (playerid) {
      Player.findOne({'playerNum':playerid},function(err,user){
        if (err) {
          console.log(err);
          return;
        }
        if (user) {
          res.render('pages/operation',{
              player:user,
              uid:playerid,
              playerNum:user.playerNum,
              chips:user.chips,
              refillsLeft:user.refillsLeft,
              tournamentAmount : tournamentAmount,
              loggedin:true
          });
        } else {
          res.render('pages/operation',{player:null,loggedin:true});
        }
      });
    } else {
      res.render('pages/operation',{player:null,loggedin:true});
    }
  });

  app.post('/addmoney', function(req, res) {
      var addAmount = parseInt(req.body.addmoneyamount);
      if (addAmount >= -1000000) { // in the case of NaN error. in that case, go to operation page
           // parseInt, transform a string to int.
          var playerId = req.body.uid;
          Player.update({'playerNum': playerId}, {$inc: {'chips': addAmount}}, function (err, user) {
              if (err) {
                  console.log(err);
                  return;
              }
              res.redirect('operation?playerNum=' + playerId);
          });
      }else{
      res.redirect('operation?playerNum=' + playerId);
      }
  });

// $inc, Mongodb, add a certain number
  app.post('/submoney', function(req, res) {
      var subAmount = -1 * parseInt(req.body.takeoutmoneyamount); // this is the most unreadable naming ever
      if (subAmount <= 1000000) {
          var playerId = req.body.uid;
          Player.update({'playerNum': playerId}, {$inc: {'chips': subAmount}}, function (err, user) {
              if (err) {
                  console.log(err);
                  return;
              }
              res.redirect('operation?playerNum=' + playerId);
          });
      }else{
          res.redirect('operation?playerNum=' + playerId);
      }
  });

  app.post('/entertournament', function(req, res) {
    var playerId = req.body.uid;
    console.log(playerId);
    var query = {'playerNum':playerId};
    Player.findOne(query,function(err,user){
      if (err) {
        console.log(err);
        return;
      }

      if (user.chips < 500) {
        res.redirect('operation?playerNum=' + playerId + '&message=' + 'this user does not have sufficient chips');
      }else if (user.tournamentsLeft <= 0) {
        res.redirect('operation?playerNum=' + playerId + '&message=' + 'this user has already entered the tournament too many times');
      }else {
        Player.update(query,{$inc:{'chips':-100,'tournamentsLeft':-1}},function(err,user){
          if (err) {
            console.log(err);
            return;
          }
          tournamentAmount += 100;
          res.redirect('operation?playerNum=' + playerId + '&message=' + 'Successfully enter this user into tournament');
        });
      }
    });
  });

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