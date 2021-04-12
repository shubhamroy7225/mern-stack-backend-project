const API_KEY = process.env.GOOGLE_API_KEY;
const axios = require("axios");
const HttpError = require("../models/http-error");
async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
  );
  const data = response.data;
  console.log(data);
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  // const coordinates = {
  //   lat:22.3177406,
  //   lng:73.1240113,
  // }
  return coordinates;
}

module.exports = getCoordsForAddress;
