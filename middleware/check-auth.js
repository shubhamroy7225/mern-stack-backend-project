const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization //authorization:'Breer Token'
    console.log(token);
    if (!token) {
      throw new Error("Authorization failed");
    }
    const decodedToken = jwt.verify(token, "Dont_share_itsPrivateKey");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authorization failed", 401);
    return next(error);
  }
};
