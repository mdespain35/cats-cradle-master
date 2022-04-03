const mongoose = require("mongoose"); // import mongoose

const Schema = mongoose.Schema; // use mongoose object for schema constructor

// extantiate schema with new schema and key value pairs with type and if required
const catSchema = new Schema({
    // forces object to have a title, description, imageUrl, and purchaseUrl
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    }
  });
  
  
  
  // model function connects the schema blueprint to name i.e., recipe
  module.exports = mongoose.model("Cat", catSchema);