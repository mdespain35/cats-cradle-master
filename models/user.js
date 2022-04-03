const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  adminPriveleges: {
      type: Boolean,
      default: false,
      required: true
  },
  appointments: [
      {
          type: Schema.Types.ObjectId,
          ref: 'Appt'
      }
  ]
});

userSchema.methods.addAppointment = function(appt) {
    this.appointments.push(appt);
    return this.save();
}

module.exports = mongoose.model('User', userSchema);