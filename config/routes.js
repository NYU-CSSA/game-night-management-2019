var Firebase = require('firebase');

module.exports = exports = function(app) {
  /* ---------  GETs ---------- */
  app.get('/', function(request, response) {
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
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
  app.get('/operation',function(req,res){
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
      res.render('pages/operation', {logined : authData});
    }
    else{
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
    }
  });

  app.get('/registration',function(req,res){
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
      res.render('pages/registration', {logined : authData});
    }
    else{
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
    }
  });

  /* --------- POSTs ----------- */ 
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
          res.redirect('/login');
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
            return;
          }
          else if(myrole === "registration")
          {
            console.log(snapshot.child(netid).child("role").val(), "render to registration");
            res.redirect('/registration');
            return;
          } 
          else
          { 
            console.log("no role, role = " + myrole);
            res.render('pages/error', {errortype : "no role"});
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
          res.render('pages/error', {errortype : "chargeRemainTimes没啦!", logined : authData});
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
    var ref = new Firebase("https://ilovemarshmellow.firebaseio.com");
    var authData = ref.getAuth();
    if (!authData) {
      res.render('pages/error', {errortype : 'please login first-v-', logined : authData});
    }
    var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
    var playerNumber = req.body.playernumber
    // TODO: varify that operater has logged in

    playerRef.once("value", function(snapshot) {
      if (snapshot.haschild(playNumber)) {

      } else {
        
      }
    });

  });

  /* --------- Not found ----------- */ 
  app.use(function (req, res) {
    res.status(404).render('pages/error', {errortype: '404 Page Not found'});
  });

}