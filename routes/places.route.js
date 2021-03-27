const placeController = require('../controllers/places-controller')
const express = require("express");
const router = express.Router();
router.get("/:pid",placeController.getPlaceById );
router.get("/users/:uid",placeController.getPlaceByUserId );
router.post('/',placeController.createPlace)
module.exports = router;
