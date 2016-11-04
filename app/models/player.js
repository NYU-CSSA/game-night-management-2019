var mongoose = require('mongoose');

// define the schema for our user model
var playerSchema = mongoose.Schema({
	playerNum : String,
	refillsLeft : {type:Number, default: 3},
	chips : {type:Number,default:500},
	tournamentsLeft : {type:Number,default:3}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Player', playerSchema);