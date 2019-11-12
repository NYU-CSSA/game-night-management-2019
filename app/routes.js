var Player = require("./models/player");

module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('pages/index', {loggedin: req.isAuthenticated()});
    });

     app.get('/docs', function (req, res) {
        res.render('pages/documentation', {loggedin: req.isAuthenticated()});
    });

    app.get('/signup', isLoggedIn, function (req, res) {
        res.render('pages/signup', {message: req.flash('signupMessage'), loggedin: req.isAuthenticated()});
    });

    app.get('/login', function (req, res) {
        res.render('pages/login', {message: req.flash('signupMessage'), loggedin: req.isAuthenticated()});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {

        successRedirect: '/login', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/operation', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/signout', isLoggedIn, function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/registration', isLoggedIn, function (req, res) {
        var uid = req.query.uid; // uid is the input ID
        if (!uid) {
            res.render('pages/registration', {loggedin: req.isAuthenticated(), msg: null});
        } else {
            var message = "created player " + uid;
            res.render('pages/registration', {loggedin: req.isAuthenticated(), msg: message})
        }
    });

    app.get('/buyin', isLoggedIn, function (req, res) {
        var op = req.query.op; // op is the button of Creat/Add
        var uid = req.query.uid; // uid is the input ID
        if (!op || !uid) {
            res.render('pages/buyin', { loggedin: req.isAuthenticated(), msg: null });
        } else {
            message = "added 500 for player " + uid;
            res.render('pages/buyin', { loggedin: req.isAuthenticated(), msg: message })
        }
    });

    app.post('/buyin',isLoggedIn,(req,res)=>{
        var uid = req.body.netId; 
        if (uid) {
            Player.findOne({ 'netId': uid }, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (user) {
                    // update an existing user
                    Player.updateOne({ 'netId': uid }, {
                        $inc: {
                            'chips': 500,
                        }
                    }, function (err, user) {
                        if (err) {
                            return res.render('pages/buyin', {
                                loggedin: req.isAuthenticated(),
                                msg: "Error adding chips"
                            });
                        }
                            res.render('pages/buyin', {
                            loggedin: req.isAuthenticated(),
                            msg: "Successfully added 500 chips to player " + uid
                        });
                    });
                }else{
                    res.render('pages/buyin', {
                        loggedin: req.isAuthenticated(),
                        msg: "No such player. Please register first."
                    });                
                }
            }) 
        } else {
            res.render('pages/buyin', { loggedin: req.isAuthenticated(), msg: "Please enter player netid" });
        }
    })

    app.get('/topplayers', function (req, res) {
        console.log("querying topplayers");
        Player.find({}).sort({'chips': -1}).limit(10).exec(function (err, players) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }
            res.status(200).send(JSON.stringify(players) || {});
        });
    });

    app.post('/registration', isLoggedIn, function (req, res) {
        var uid = req.body.netId;
        var nickn = req.body.nickname;

        if (uid) {
            Player.findOne({'netId': uid}, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }

                if (user) {
                    res.render('pages/registration', {
                        loggedin: req.isAuthenticated(),
                        msg: `player ${uid} already exists. cannot register.`
                    });
                } else if (nickn===""){
                    res.render('pages/registration', {
                        loggedin: req.isAuthenticated(),
                        msg: `please enter a nickname for player ${uid}.`
                    });
                }
                else {
                    // create a player
                    var player = new Player();
                    player.netId = uid;
                    player.nickname = nickn;

                    player.save(function (err) {
                        if (err) {
                            throw err;
                        }
                        res.render('pages/registration', {
                            loggedin: req.isAuthenticated(),
                            msg: "Successfully created player " + uid 
                        });
                    });
                }
            });
        } else {
            res.render('pages/registration', {loggedin: req.isAuthenticated(), msg: "Please enter player netid"});
        }
    });

    app.get('/operation', isLoggedIn, function (req, res) {
        var playerid = req.query.netId;
        console.log(playerid);
        if (playerid) {
            Player.findOne({'netId': playerid}, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                // console.log(user)
                if (user) {
                    res.render('pages/operation', {
                        player: user,
                        uid: playerid,
                        nickname: user.nickname,
                        chips: user.chips,
                        loggedin: true,
                        msg:""
                    });
                } else {
                    res.render('pages/operation', { player: null, loggedin: true, msg: "Player not found"});
                }
            });
        } else {
            res.render('pages/operation', { player: null, loggedin: true, msg: ""});
        }
    });

    // $inc, Mongodb, add a certain number
    app.post('/addmoney', function (req, res) {
        var addAmount = parseInt(req.body.addmoneyamount);
        if (addAmount >= -1000000) { // in the case of NaN error. in that case, go to operation page
            // parseInt, transform a string to int.
            var playerId = req.body.uid;
            Player.updateOne({ 'netId': playerId }, { $inc: { 'chips': addAmount}}, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.redirect('operation?netId=' + playerId + '&addedAmount=' +addAmount);
            });
        } else {
            res.redirect('operation');
        }
    });

    app.post('/submoney', function (req, res) {
        var subAmount = parseInt(req.body.takeoutmoneyamount); // this is the most unreadable naming ever
        if (subAmount <= 1000000) {
            var playerId = req.body.uid;
            Player.updateOne({ 'netId': playerId }, { $inc: { 'chips': -subAmount} }, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.redirect('operation?netId=' + playerId + '&subtractedAmount=' + subAmount);
            });
        } else {
            res.redirect('operation');
        }
    });

    app.get("/get_player_score",function(req,res){
       Player.find({}).sort({'chips': -1}).limit(10).exec(function (err, players) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }
            res.send(JSON.stringify(players) || {});
        });
    })

    // app.post('/entertournament', function (req, res) {
    //     var playerId = req.body.uid;
    //     console.log(playerId);
    //     var query = {'netId': playerId};
    //     Player.findOne(query, function (err, user) {
    //         if (err) {
    //             console.log(err);
    //             return;
    //         }
    //         if (user.chips < 500) {
    //             res.redirect('operation?netId=' + playerId + '&message=' + 'this user does not have sufficient chips');
    //         } else {
    //             res.redirect('operation?netId=' + playerId + '&message=' + 'Successfully enter this user into tournament');
    //         }
    //     });
    // });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}