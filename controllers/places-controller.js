const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const { getCoordinatesForAddress } = require("../util/location");
const PlaceSchema = require("../models/placeSchema");
let Dummy_data = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famus sky scrapers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 w 34th st,New York, NY 1001",
    creator: "u1",
  },
];
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await PlaceSchema.findById(placeId);
  } catch (err) {
    const error = new HttpError("could not find places", 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }
  res.json(place);
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // const places = Dummy_data.filter((place) => place.creator === userId);
  let places;
  try {
    places = await PlaceSchema.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("could not find places", 500);
    return next(error);
  }
  if (!places || places.longth === 0) {
    return next(
      new HttpError("Could not find a places for the provided user id.", 404)
    );
  }
  res.json(places.map((place) => place.toObject({ getters: true })));
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Fields can not be empty!");
  }

  const { title, description, address, creator } = req.body;
  const coordinates = getCoordinatesForAddress(address);
  const createPlace = new PlaceSchema({
    title,
    description,
    location: coordinates,
    address,
    image: "https://homepages.cae.wisc.edu/~ece533/images/pool.png",
    creator,
  });
  try {
    await createPlace.save();
  } catch (err) {
    return next(err);
  }
  res.send(createPlace);
};
const updatePlaceById = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Fields can not be empty!");
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await PlaceSchema.findById(placeId);
  } catch (err) {
    const error = new HttpError("could not find places", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("could not save your data ", 500);
    return next(error);
  }
  if (!place) {
    return next(
      new HttpError("Could not find a places for the provided user id.", 404)
    );
  }
  res.json(place.toObject({ getters: true }));
  
};
const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  if (!Dummy_data.find((place) => place.id == placeId)) {
    throw new HttpError("Could not find a place for that id.", 404);
  }
  Dummy_data = Dummy_data.filter((place) => place.id !== placeId);
  res.status(200).json({ message: "place deleted" });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
