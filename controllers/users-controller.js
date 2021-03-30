const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const UserSchema = require("../models/userSchema");

const Dummy_data = [
  {
    id: "u1",
    name: "shubham",
    address: "20 w 34th st,New York, NY 1001",
  },
];
const getAllUser = (req, res, next) => {
  res.json(Dummy_data);
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  console.log(error)
  if (!error.isEmpty()) {
    return next(new HttpError("Fields can not be empty!",222));
  }
  const { name, email, password,places } = req.body;
  let userExist;
  try {
    userExist = await UserSchema.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed paease try agan", 500);
    return next(error);
  }
  if (userExist) {
    const error = new HttpError("User is already exist", 500);
    return next(error);
  }
  const createUser = new UserSchema({
    name,
    email,
    password,
    image: "https://homepages.cae.wisc.edu/~ece533/images/girl.png",
    places
  });
  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError("could not save your data ", 500);
    return next(error);
  }

  res.json(createUser.toObject({ getters: true }));
};
const signin = async(req, res, next) => {
  const { email, password } = req.body;
  let userExist;
  try {
    userExist = await UserSchema.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed paease try agan", 500);
    return next(error);
  }
  if (!userExist) {
    return next(new HttpError("email not exist", 401));
  } else if (userExist && userExist.password !== password) {
    return next(new HttpError("password in invalid!",401));
  }
 res.json({ message: "logged in!" });
};
exports.getAllUser = getAllUser;
exports.signin = signin;
exports.signup = signup;
