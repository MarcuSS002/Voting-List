const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  party : {
    type: String,
    required: true
  },
  votes: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        votedAt: {
            type: Date,
            default: Date.now
        }
    }
  ],
  voteCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
