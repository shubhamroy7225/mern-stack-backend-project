const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: Array },
  yourexprience:{ type: String, required: true },
  description: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  total_users_rated: { type: Number },
  sum_of_rating: { type: Number },
  total_rating: { type: Number },
  comments: { type: Array },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
});
module.exports = mongoose.model("places", placeSchema);
