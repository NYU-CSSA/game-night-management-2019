var mongoose = require('mongoose');

// define the schema for our user model
var tournamentSchema = mongoose.Schema({
	chipPool : {type: Number, default:0}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Tournament', tournamentSchema);
