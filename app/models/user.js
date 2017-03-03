var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
	username: {type: String, lowercase: true, required: true, unique: true},
	password: {type: String, required: true},
	email: {type: String, lowercase: true, required: true, unique: true},
	firstName: {type: String},
	lastName: {type: String},
	description: {type: String},
	links:  {type: Array},
	linksNames:  {type: Array},
	isEmpty: {type: Boolean, default: true},
	profilePicture: {type: String, default: 'uploads/images/default.jpg'},
	screenshots: {type: Array},
	works: {type:Array},
	reps: {type:Array}
});


//do this before saving the schema
// UserSchema.pre('save', function(next){
// 	//bycrypting the password, because Queen Lana cares for your privacy
// 	var user = this;
// 	bcrypt.hash(user.password, null, null, function(err, hash){
// 		if(err){
// 			return next(err);
// 		}
// 		user.password = hash;
// 		next();
// 	});
// });

// //password validation
// UserSchema.methods.comparePassword = function(password){
// 	return bcrypt.compareSync(password, this.password); //password: given password, this.password: current user's pass
// };


module.exports = mongoose.model('User', UserSchema);

