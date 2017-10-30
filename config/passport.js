var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var Staff = require('../app/models/staff');

// expose this function to our app using module.exports
module.exports = function (passport) {
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        Staff.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            console.log("email");
            console.log(email);
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                Staff.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error
                    if (err) {
                        console.log(error);
                        return done(err);
                    } else if (user) { // email has been registered
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new Staff();
                        newUser.email = email; // set the user's local credentials
                        newUser.password = newUser.generateHash(password);
                        console.log("creating staff");
                        newUser.save(function (err) { // save the user
                            if (err) {throw err;}
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email, we are checking to see if the user trying to login already exists
            Staff.findOne({'email': email}, function (err, user) {
                // if there are any errors, return the error before anything else
                if (err) {
                    return done(err);
                }
                else if (!user) { // if no user is found, return the message
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                } else if (!user.validPassword(password)) {// if the user is found but the password is wrong
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                return done(null, user);
            });
        }));
};