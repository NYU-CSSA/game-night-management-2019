var Firebase = require('firebase');
var player = require('player');

module.exports = exports = function(app) {


  /* ---------  GETs ---------- */
  app.get('/', function(request, response) {
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    //check server log in status
    if (authData) {
      console.log("server : Authenticated user with uid:", authData.uid);
    }
    else{
      console.log("server: not logged in");
    }
    response.render('pages/index', {logined : authData});
  });

  app.get('/login', function(request, response) {
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    ref.unauth();
    response.render('pages/login');
  });

  app.get('/signup', function(request, response) {
    response.render('pages/signup');
  });

  app.get('/error', function(request, response) {
    response.render('pages/error');
  });

  /* -------- With Authoration ----------- */
  app.get('/operation', function(req, res) {
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (!authData) {
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
      return;
    }
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    var tnmtRef = new Firebase("https://ilovemarshmellow.firebaseio.com/tournament");
    var chipInPoll = 0;
    tnmtRef.once("value", function(snapshot) {
      chipInPoll = snapshot.child("chipPool").val();
    });
    var playerid = req.query.uid;
    var curPlayer = null
    if (playerid) {
        playerRef.once("value", function(snapshot) {
        if (snapshot.hasChild(playerid)) {
          var curPlayerRef = snapshot.child(playerid);
          curPlayer = {};
          curPlayer['id'] = playerid;
          curPlayer['chips'] = curPlayerRef.child('chips').val();
          curPlayer['times'] = curPlayerRef.child('chargeRemainTimes').val();
          res.render('pages/operation', { player: curPlayer, logined : authData, chipsInPool: chipInPoll});
          return;
        } else {
          // TODO: pop up a window or sth
          res.render('pages/operation', { player: null, logined: authData, chipsInPool: chipInPoll});
          console.log("player doesn't exist");
        }
        console.log(snapshot.val());
      }, function (errObject) {
        console.log("Read from player ref failed: " + errObject.code);
      });
    } else {
      res.render('pages/operation', { player: curPlayer, logined : authData, chipsInPool: chipInPoll});
    }
  });

  app.get('/registration',function(req,res){
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
      var op = req.query.op;
      var uid = req.query.uid;
      if (!op || !uid) {
        res.render('pages/registration', {logined : authData, msg: null});
      } else {
        var messange = null;
        if (op == "add") {
          messange = "added 100 for player " + uid;
        } else if (op == "create") {
          messange = "created player " + uid;
        }
        res.render('pages/registration', {logined : authData, msg: messange}); 
      }
    }
    else{
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
    }
  });

  /* --------- POSTs ----------- */ 
  app.post('/signup', function(req, res) {
    if (req.body.password != req.body.crnfrmpassword) {
      console.log("not the same password");
      res.render('pages/error', {errortype : "not the same password"});
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
        res.redirect('/login');
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
            res.redirect('/operation');
          }
          else if(myrole === "registration")
          {
            console.log(snapshot.child(netid).child("role").val(), "render to registration");
            res.redirect('/registration');

          } 
          else
          { 
            console.log("no role, role = " + myrole);
            var ref = new Firebase("https://ilovemarshmellow.firebaseio.com/");
            ref.unauth();
            res.render('pages/error', { errortype : "you need permission to access" });
          }
        });
      }
    });
  });

  app.post('/registration', function(req,res){
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (!authData) {
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
    }
    var uid = req.body.playNo;
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    playerRef.once("value", function(snapshot){
      if(snapshot.hasChild(uid.toString())) {
        var tmp = snapshot.child(uid.toString()).child("chargeRemainTimes").val();
        if(tmp > 0){
          playerRef.child(uid.toString()).update({
            chargeRemainTimes : tmp - 1,
            chips : snapshot.child(uid.toString()).child("chips").val() + 100
          });
          console.log("Add 100, time--");
          console.log("chargeRemainTimes = " + snapshot.child(uid.toString()).child("chargeRemainTimes").val());
          res.redirect('/registration?op=add&uid=' + uid);
        }
        else{
          console.log("chargeRemainTimes没啦!");
          res.render('pages/error', {errortype : "chargeRemainTimes没啦!", logined : authData});
        }
      }
      else{
        playerRef.child(uid.toString()).update(
          {
            "chargeRemainTimes" : 3,
            "chips" : 100,
            "tnmremaintimes" : 3
          });
        console.log("Add 100(created)");
        res.redirect('/registration?op=create&uid=' + uid);
      }
    });
  });

  // by Anna
  // find a player in firebase when dealer assistant clicks 'find'
  app.post('/findplayer', function(req, res) {
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (!authData) {
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
      return;
    }
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    var playerNumber = req.body.playernumber;
    res.redirect('/operation?uid=' + playerNumber);

  }); 

  app.post('/addmoney', function(req, res) {
    var addAmount = parseInt(req.body.addmoneyamount);
    var playerid = req.body.uid;
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    var curPlayerRef = playerRef.child(playerid.toString());
    curPlayerRef.once("value", function(snapshot) {
      var curChips = snapshot.child("chips").val();
      curPlayerRef.update({ chips: curChips + addAmount });
    });
    res.redirect('operation?uid=' + playerid);
  });

  app.post('/submoney', function(req, res) {
    var subAmount = parseInt(req.body.takeoutmoneyamount);
    var playerid = req.body.uid;
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    var curPlayerRef = playerRef.child(playerid.toString());
    curPlayerRef.once("value", function(snapshot) {
      var curChips = snapshot.child("chips").val();
      if (curChips >= subAmount) {
        curPlayerRef.update({ chips: curChips - subAmount });        
      }
    });
    res.redirect('operation?uid=' + playerid);
  });

  app.post('/entertournament', function(req, res) {
    var playerid = req.body.uid;
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    var tnmtRef = new Firebase("https://ilovemarshmellow.firebaseio.com/tournament");
    var curPlayerRef = playerRef.child(playerid.toString());
    curPlayerRef.once("value", function(snapshot) {
      var curtnmremaintimes = snapshot.child("tnmremaintimes").val();
      if (curtnmremaintimes <= 0) {
        res.render('pages/error', {errortype : "已经进3次惹"})
        return;
      }
      var curChips = snapshot.child("chips").val();
      if (curChips >= 50) {
        curPlayerRef.update({ chips: curChips - 50 });
        curPlayerRef.update({ tnmremaintimes: curtnmremaintimes - 1 });
        tnmtRef.once("value", function(snapshot) {
          var curInPool = snapshot.child("chipPool").val();
          tnmtRef.update({chipPool: curInPool + 500});
        });        
      }
      res.redirect('operation?uid=' + playerid);
    });
    
  });
  /* --------- Not found ----------- */ 
  app.use(function (req, res) {
    res.status(404).render('pages/error', {errortype: '404 Page Not found'});
  });

  

}