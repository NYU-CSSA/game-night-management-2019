var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cssa-game-night'); // test connection with mongodb
console.log("mongoose connection status: " + mongoose.connection.readyState + ". // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting");


var Staff = require('./app/models/staff');

var newUser = new Staff();
var email = "daimingzhong@gmail.com";
var password = "123";
newUser.email = email; // set the user's local credentials
newUser.password = newUser.generateHash(password);
console.log("creating staff");
newUser.save(function (err) { // save the user
    if (err) {throw err;}
});