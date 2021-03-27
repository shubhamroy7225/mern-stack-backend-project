const placeController = require('../controllers/places-controller')
const express = require("express");
const router = express.Router();
router.get("/:pid",placeController.getPlaceById );
router.get("/user/:uid",placeController.getPlacesByUserId );
router.post('/',placeController.createPlace)
router.patch('/:pid',placeController.updatePlaceById)
router.delete('/:pid',placeController.deletePlaceById)
module.exports = router;
