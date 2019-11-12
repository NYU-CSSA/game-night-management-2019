
// connect to mongodb database
// TODO: use environment variable
const path = require('path')
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-node")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const dbURI = process.env.ATLAS_URI

console.log(dbURI)

mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true}, function (error) {
	//Errors here
	// console.log(error);
});

// define the schema for our user model
var staffSchema = mongoose.Schema({
	email :String,
	password :String,
	role : String,
	game : String
});

staffSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// create the model for users and expose it to our app
let Staff = mongoose.model('Staff', staffSchema);

// define a list of staff's email
let emailList = `sm7515@nyu.edu
ml5333@nyu.edu
yw3210@nyu.edu
yw3208@nyu.edu
bx417@nyu.edu
hy1655@nyu.edu
yl6435@nyu.edu
jt3823@nyu.edu
bc2716@nyu.edu
bz1037@nyu.edu
ah4771@nyu.edu
jw5524@nyu.edu
xh990@nyu.edu
wl1877@nyu.edu
zj637@nyu.edu
hy1461@nyu.edu
hl3003@nyu.edu
yl5287@nyu.edu
zw1794@nyu.edu
sc7808@nyu.edu
yhg208@nyu.edu
bz1072@nyu.edu
yc3361@nyu.edu
cj1231@nyu.edu
az1876@nyu.edu
yht243@nyu.edu
yw4359@nyu.edu`

const createStaff = (emailList, defaultPassword) => {

	var emailList = emailList.split("\n")

	for(var i=0; i < emailList.length; i++){
		var newUser = new Staff();
		var email = emailList[i];
		var password = defaultPassword;
		newUser.email = email; 
		newUser.password = newUser.generateHash(password);
		console.log(`creating user ${newUser.email}`)
		newUser.save(function (err) {
			if (err) {
				throw err;
			}
		});
		// Staff.findOne({ email: emailList[i] },function (err,user) {
		// 	if(err) console.log(err)
		// 	if (user) console.log("staff already exists!")
		// 	else {
		// 		newUserList.push(newUser);
		// 		console.log("hiii")
		// 	}
		// })

	}
	console.log(`${emailList.length} staffs created`)
}

let defaultPassword = "888"
createStaff(emailList, defaultPassword)
