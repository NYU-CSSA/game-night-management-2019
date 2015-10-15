var mongoose = require('mongoose');

// define the schema for our user model
var playerSchema = mongoose.Schema({
	playerNum : String,
	refillsLeft : Number,
	chips : Number,
	tournamentsLeft : Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Player', playerSchema);