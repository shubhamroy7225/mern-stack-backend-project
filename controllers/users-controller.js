const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const UserSchema = require("../models/userSchema");

const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await UserSchema.find();
  } catch (err) {
    const error = new HttpError("Fetching users failed,please try again", 500);
    return next(error);
  }
  res.json(users.map((user) => user.toObject({ getters: true })));
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Fields can not be empty!", 222));
  }
  const { name, email, password } = req.body;
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

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch {
    const error = new HttpError("Could not create user,please try again", 500);
    return next(error);
  }

  const createUser = new UserSchema({
    name,
    email,
    password: hashPassword,
    image: req.file.path,
    places: [],
  });
  try {
    await createUser.save();
  } catch (err) {
    const error = new HttpError("could not save your data ", 500);
    return next(error);
  }

  let token;
  try {
    token = await jwt.sign(
      { usrId: createUser.id, enail:createUser.email },
      "Dont_share_itsPrivateKey",
      { expiresIn: "1h" }
    );
  } catch(err){
    const error = new HttpError("could not save your data ", 500);
    return next(error);
  }
  res.json({userId:createUser.id, email:createUser.email,token:token});
};

const signin = async (req, res, next) => {
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
  }
  //  else if (userExist && userExist.password !== password) {
  //   return next(new HttpError("password in invalid!", 401));
  // }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, userExist.password);
  } catch {
    const error = new HttpError("Your username or password is wrong", 500);
    return next(error);
  }
  if (!isValidPassword) {
    return next(new HttpError("password in invalid!", 401));
  }
  let token;
  try {
    token = await jwt.sign(
      { usrId: userExist.id, enail: userExist.email },
      "Dont_share_itsPrivateKey",
      { expiresIn: "1h" }
    );
  } catch(err){
    const error = new HttpError("Failed to login ", 500);
    return next(error);
  }
  res.json({userId:userExist.id, email:userExist.email,token:token});
};
exports.getAllUser = getAllUser;
exports.signin = signin;
exports.signup = signup;
