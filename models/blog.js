let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String },
  date_of_publication: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);
