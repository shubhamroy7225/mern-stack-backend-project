const placeController = require('../controllers/places-controller')
const express = require("express");
const router = express.Router();
router.get("/:pid",placeController.getPlaceById );
router.get("/users/:uid",placeController.getPlaceByUserId );
router.post('/',placeController.createPlace)
router.patch('/:pid',placeController.updatePlaceById)
router.delete('/',placeController.deletePlaceById)
module.exports = router;
