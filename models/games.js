const mongoose = require("mongoose"); // import mongoose

const Schema = mongoose.Schema; // use mongoose object for schema constructor

// extantiate schema with new schema and key value pairs with type and if required
const gameSchema = new Schema({
    // forces object to have a title, description, imageUrl, and purchaseUrl
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      thumbnail: {
        type: String,
        required: false
      },
      full: {
        type: String,
        required: false
      }
    },
    purchaseUrl: {
      type: String,
      required: true,
    },
  });
  
  
  
  // model function connects the schema blueprint to name i.e., recipe
  module.exports = mongoose.model("Games", gameSchema);