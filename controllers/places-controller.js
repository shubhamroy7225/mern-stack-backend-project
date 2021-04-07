const { validationResult } = require("express-validator");
const fs = require("fs");
const HttpError = require("../models/http-error");
const { getCoordinatesForAddress } = require("../util/location");
const PlaceSchema = require("../models/placeSchema");
const UserSchema = require("../models/userSchema");
const mongoose = require("mongoose");
const placeSchema = require("../models/placeSchema");
const userSchema = require("../models/userSchema");
const { upload } = require("../middleware/multiplefile-uploader");
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
    return next(new HttpError("Fields can not be empty!"));
  }

  const { title, description, address } = req.body;
  const coordinates = getCoordinatesForAddress(address);
  let imgArray = [];
  for (let i in req.files) {
    let obj = {};
    obj[i] = req.files[i].path;
    imgArray.push(obj);
  }
  const createPlace = new PlaceSchema({
    title,
    description,
    location: coordinates,
    address,
    image: imgArray,
    total_users_rated: 0,
    sum_of_rating: 0,
    total_rating: 0,
    comments: [],
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await UserSchema.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provide id");
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await createPlace.save({ session: session });
    user.places.push(createPlace);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("place data not saved", 500));
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
  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit the place", 401);
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
const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await PlaceSchema.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "can not delete the place please try again!",
      5000
    );
  }
  if (!place) {
    return next(new HttpError("Could not find the place"));
  }
  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError("You are not allowed to delete the place", 401);
    return next(error);
  }

  const placeImage = place.image;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.remove({ session: session });
    place.creator.places.pull(place);
    place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("place data not saved", 500));
  }
  fs.unlink(placeImage, (err) => {
    console.log(err);
  });
  res.json({ message: "place deleted" });
};

const addRatingByPlaceId = async (req, res, next) => {
  const { rating, id } = req.body;
  let place;
  try {
    place = await placeSchema.findById(id);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  if (place) {
    place.total_users_rated += 1;
    sum_of_max_rating_of_user_count = place.total_users_rated * 5;
    place.sum_of_rating += rating;
    place.total_rating =
      (place.sum_of_rating * 5) / sum_of_max_rating_of_user_count;
  }
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("could not save your data ", 500);
    return next(error);
  }
  res.json(req.body);
};
const createComments = async (req, res, next) => {
  const { userId, comment } = req.body.comment;
  const { id } = req.body;
  let user;
  try {
    user = await userSchema.findById(userId);
  } catch (err) {
    const error = new HttpError("User not found, please try again", 500);
    return next(error);
  }
  let place;
  try {
    place = await placeSchema.findById(id);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  if (!place || !user) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  if (place && user) {
    let commentData = {
      userName: user.name,
      userImage: user.image,
      userComment: comment,
    };
    place.comments.push(commentData);
  }
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("could not save your data ", 500);
    return next(error);
  }
  res.json(req.body);
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
exports.addRatingByPlaceId = addRatingByPlaceId;
exports.createComments = createComments;
