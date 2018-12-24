// define the schema for our user model
//let url = "mongodb://daimingzhong:123456@ds125555.mlab.com:25555/test-1"
let url =  "mongodb://jeffcx:a12345@ds147044.mlab.com:47044/nyucssa-gamenight"
const mongoose = require('mongoose');
const bcrypt = require("bcrypt-node")
mongoose.connect(url);

var staffSchema = mongoose.Schema({
	email :String,
	password :String,
	role : String,
	game : String
});

staffSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
staffSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
let Staff = mongoose.model('Staff', staffSchema);


lst = `cs5075@nyu.edu
xl2228@nyu.edu
mikechenwm@gmail.com
yw3210@nyu.edu
xm535@nyu.edu
yc3361@nyu.edu
xc1295@nyu.edu
changgeng@nyu.edu
ah4771@nyu.edu
ts3385@nyu.edu
my1793@nyu.edu
kl3348@nyu.com
xw1901@nyu.edu
yf874@nyu.edu
xz2183@nyu.edu
lw1952@nyu.edu
hl3003@nyu.edu
tl2594@nyu.edu
ys3453@nyu.edu
yz5164@nyu.edu
jk5542@nyu.edu
zd470@nyu.edu
yf1204@nyu.edu
qw735@nyu.edu
xg542@nyu.edu
pp1813@nyu.edu
fw724@nyu.edu
zy1222@nyu.edu
ms10001@nyu.edu
cathyes@163.com
`

lst = lst.split("\n")
for(var i=0;i<lst.length;i++){
	var newUser = new Staff();
var email = lst[i];
var password = "123";
newUser.email = email; // set the user's local credentials
newUser.password = newUser.generateHash(password);
console.log("creating staff");
newUser.save(function (err) { // save the user
    if (err) {throw err;}
});
}
console.log("done")


