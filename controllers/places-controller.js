const { v4: uuidv4 } = require('uuid');
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
  const createPlace = (req,res,next)=>{
      const {title,description,coordinates,address,creator}=req.body
      const createPlace = {
          id:uuidv4(),
          title,
          description,
          location:coordinates,
          address,
          creator
      }
      Dummy_data.push(createPlace)
      res.send(createPlace)
  }
  const updatePlaceById=(req,res,next)=>{
      const {title,description}=req.body
      const placeId = req.params.pid;
      const updatedplace = {...Dummy_data.find(place=>place.id===placeId)}
      updatedplace.title=title
     updatedplace.description=description
     const index = Dummy_data.findIndex(place=>place.id ===placeId)
     Dummy_data[index]=updatedplace
    res.status(200).json(updatedplace)
  }
  const deletePlaceById = ()=>{

  }
  exports.getPlaceById=getPlaceById
  exports.getPlaceByUserId=getPlaceByUserId
  exports.createPlace = createPlace
  exports.updatePlaceById=updatePlaceById
  exports.deletePlaceById=deletePlaceById