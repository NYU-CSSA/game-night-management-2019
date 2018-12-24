// define the schema for our user model
//let url = "mongodb://daimingzhong:123456@ds125555.mlab.com:25555/test-1"
let url =  "mongodb://jeffcx:a12345@ds147044.mlab.com:47044/nyucssa-gamenight"
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-node")
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



lst = []

for(var i=53600;i<53810;i++){
	var gan = "A" + i
	lst.push(gan)
}

/*

lst = []

for(var i=47401;i<47610;i++){
	var gan = "B" + i
	lst.push(gan)
}
*/


/*

for(var i=0;i<lst.length;i++){
	var newPlayer = new player();

newPlayer.playerNum = lst[i]; // set the user's local credentials
newPlayer.team="red"
console.log("creating player");
newPlayer.save(function (err) { // save the user
    if (err) {throw err;}
});
}
console.log("done")*/


