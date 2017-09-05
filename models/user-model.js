const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true,
    set: function(newValue) {
      return Hash.isHashed(newValue) ? newValue : Hash.generate(newValue);
    }
  },
});

UserSchema.statics.authenticate = function(username, password, callback) {
	this.findOne({ username: username }, function(error, user) {
		if (user && Hash.verify(password, user.password)) {
			callback(null, user);
		} else if (user || !error) {
			// Email or password was invalid (no MongoDB error)
			error = new Error("Your email address or password is invalid. Please try again.");
			callback(error, null);
		} else {
			// Something bad happened with MongoDB. You shouldn't run into this often.
			callback(error, null);
		}
	});
};
