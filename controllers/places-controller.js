const HttpError = require("../models/http-error");
const Dummy_data = [
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
const getPlaceById = (req, res,next) => {
    const placeId = req.params.pid;
    const place = Dummy_data.find((place) => place.id === placeId);
    if (!place) {
      throw new HttpError("Could not find a place for the provided id.", 404);
    }
    res.json(place);
  }

  const getPlaceByUserId = (req, res,next) => {
    const userId = req.params.uid;
    const user = Dummy_data.find((user) => user.creator === userId);
    if (!user) {
      return next(new HttpError("Could not find a place for the provided id.",404))
    }
    res.json(user);
  }
  exports.getPlaceById=getPlaceById
  exports.getPlaceByUserId=getPlaceByUserId