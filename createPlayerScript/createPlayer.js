// connect to mongodb database
// TODO: use environment variable
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbURI = process.env.ATLAS_URI
mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true }, function (error) {
	//Errors here
	// console.log(error);
});

// define the schema for our user model
var playerSchema = mongoose.Schema({
	netId : String,
	nickname:String,
	refillsLeft : {type:Number, default: 2},
	chips : {type:Number,default:500},
	tournamentsLeft : {type:Number,default:3}
});

// create the model for users and expose it to our app
let player =  mongoose.model('Player', playerSchema);
let playerList =`ml5333 黑洞
sm7515 宅鸡🐣`
const createPlayers = (playerList) => {

	playerList = playerList.split('\n')

	for(var i = 0 ; i < playerList.length ; i++){
		let info = playerList[i].split(' ');
		let newPlayer = new player();
		newPlayer.netId = info[0]; // set the user's local credentials
		newPlayer.nickname = info[1];
		console.log(`creating player ${playerList[i]}`);
		newPlayer.save(function (err) { // save the user
			if (err) {throw err;}
		});
	}

	console.log(`${playerList.length} players created`)

}


createPlayers(playerList)





