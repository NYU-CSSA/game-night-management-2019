var Firebase = require("firebase");
var playerRef = new Firebase("https://ilovemarshmellow.firebaseio.com/player");
var tournamentRef = new Firebase("https://ilovemarshmellow.firebaseio.com/tournament");
var events = require('events');
var eventEmitter = new events.EventEmitter();

var player = function(uid){

	this.data = {
		id: null,
		chips: null,
		chargeRemainTimes: null
	};

	this.fill = function(){
		this.data["id"] = uid;
		this.data["chips"] = this.getchips();
		this.data["chargeRemainTimes"] = this.getChargeRemainTimes();
		//eventEmitter.emit('dataLoaded');
	};

	this.getProfile = function(){
		this.fill();
		return this.data;
		
	};

	this.getchips = function(){
		//console.log(uid);
		var chip;
		playerRef.child(uid.toString()).on("value", function(snapshot){
			console.log(snapshot.child("chips").val());
			chip = snapshot.child("chips").exportVal();
		});
		return chip;
	};

	this.getChargeRemainTimes = function(){
		var chargeRemainTimes;
		playerRef.child(uid.toString()).on("value", function(snapshot){
			console.log(snapshot.child("chargeRemainTimes").val());
			chargeRemainTimes = snapshot.child("chargeRemainTimes").exportVal();
		});
		return chargeRemainTimes;
	};

	//add chip
	this.addChips = function(num){
		var chip = this.data["chips"];
		chip = chip + num;
		this.data["chips"] = chip;
		playerRef.child(uid.toString()).update({"chips" : chip});
		console.log("chip");
	};

	this.subtractChips = function(num){
		var chip = this.data["chips"];
		if (chip >= num){
			chip = chip - num;
			this.data["chips"] = chip;
			playerRef.child(uid.toString()).update({"chips" : chip});
			console.log("chip");
		}else{
			console.log("insufficient fare");
			return;	
		}

	}

	this.joinTournament = function(){
		var chip = this.data["chips"];
		if (chip >= 50){
			chip = chip - 50;
			this.data["chips"] = chip;
			playerRef.child(uid.toString()).update({"chips" : chip});
			var chipPool;
			tournamentRef.child("chipPool").on("value", function(snapshot){
				chipPool = snapshot.exportVal();
			});
			chipPool = chipPool + 50;
			tournamentRef.update({"chipPool": chipPool });
		}
		else{
			console.log("insufficient fare");
			return;
		}
	}

	this.charge = function(){
		var chargeRemainTimes = this.data["chargeRemainTimes"];
		if (chargeRemainTimes > 0){
			chip = this.data["chips"];
			chip = chip + 100;
			this.data["chips"] = chip;
			chargeRemainTimes = chargeRemainTimes - 1;
			this.data["chargeRemainTimes"] = chargeRemainTimes;
			playerRef.child(uid.toString()).update({
				"chips" : chip,
				"chargeRemainTimes": chargeRemainTimes
			});
		}else{
			console.log("No more chance to refill");
			return;
		}
	}
}


module.exports = function(uid){
	var instance = new player(uid);

	instance.fill();

	return instance;
}






