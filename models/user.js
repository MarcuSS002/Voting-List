const bcrypt = require('bcrypt');
const mongoose = require('mongoose');   
const { type } = require('os');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 0
  },
  role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter'
  },
  password: {
    type: String,
    required: true
  },
  isVoted: {
    type: Boolean,
    default: false  
  },
  aadharCardNumber: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add comparePassword method to userSchema
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


module.exports = mongoose.model('User', userSchema);
