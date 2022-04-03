const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adoptSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cat: {
    type: Schema.Types.ObjectId,
    ref: 'Cat',
    required: true
}
});

module.exports = mongoose.model('Adopt', adoptSchema);