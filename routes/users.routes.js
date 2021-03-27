const express = require("express");
const usersController = require("../controllers/users-controller");
const router = express.Router();
router.get("/",usersController.getAllUser);
router.post("/signup",usersController.signup);
router.post("/login",usersController.signin);

module.exports = router;
