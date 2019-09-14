// connect to mongodb database
// TODO: use environment variable
let url =  ""
const mongoose = require('mongoose');
mongoose.connect(url);

// define the schema for our user model
var playerSchema = mongoose.Schema({
	playerNum : String,
	team:String,
	refillsLeft : {type:Number, default: 2},
	chips : {type:Number,default:500},
	tournamentsLeft : {type:Number,default:3}
});

// create the model for users and expose it to our app
var player =  mongoose.model('Player', playerSchema);

const createPlayers = (color, startId, endId) => {

	var playerList = []

	for(var i = startId; i < endId; i++){
		var playerId = "B" + i
		playerList.push(playerId)
	}

	for(var i = 0 ; i < playerList.length ; i++){
		var newPlayer = new player();
		newPlayer.playerNum = playerList[i]; // set the user's local credentials
		newPlayer.team = color
		console.log(`creating player ${playerList[i]}`);
		newPlayer.save(function (err) { // save the user
			if (err) {throw err;}
		});
	}

	console.log(`${playerList.length} players created`)

}

let color = "blue"
let startId = 100000
let endId = 100005
createPlayers(color, startId, endId)





