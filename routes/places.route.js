const placeController = require("../controllers/places-controller");
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
router.get("/:pid", placeController.getPlaceById);
router.get("/user/:uid", placeController.getPlacesByUserId);
router.post(
  "/",
  [check("title").not().isEmpty(),
  check('description').isLength({min:5}),
  check('address').not().isEmpty()
],
  placeController.createPlace
);
router.patch("/:pid", 
[check("title").not().isEmpty(),
check('description').isLength({min:5}),
],
placeController.updatePlaceById);
router.delete("/:pid", placeController.deletePlaceById);
module.exports = router;
