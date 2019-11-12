var mongoose = require('mongoose');

// define the schema for our user model
var playerSchema = mongoose.Schema({
	netId : String,
	nickname:String,
	chips : {type:Number,default:500},
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Player', playerSchema);
