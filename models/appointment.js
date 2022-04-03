const mongoose = require("mongoose"); // import mongoose

const Schema = mongoose.Schema; // use mongoose object for schema constructor

// extantiate schema with new schema and key value pairs with type and if required
const appointmentSchema = new Schema({
    // forces object to have a date, and reference to a user, cat, and room
    date: {
        type: Date,
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
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    game: {
        type:Schema.Types.ObjectId,
        ref: 'Games',
        required: true
    }
  });
  
  
  
  // model function connects the schema blueprint to name i.e., recipe
  module.exports = mongoose.model("Appt", appointmentSchema);