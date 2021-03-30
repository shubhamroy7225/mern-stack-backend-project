const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");

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

const signup = (req, res, next) => {
  
  const error = validationResult(req)
  if(!error.isEmpty()){
    throw new HttpError('Fields can not be empty!')
  }
  const { name, email, password } = req.body;
  const isEmail = Dummy_data.find(data=>data.email === email)
  if (isEmail) {
    throw new HttpError("Email is already exist.", 422);

  }
  const data = {
    id: uuid(),
    name,
    email,
    password,
  };
  Dummy_data.push(data);
  res.json(Dummy_data);
};
const signin = (req, res, nex) => {
    const {email,password}= req.body
    const identifiedUser= Dummy_data.find(data=>data.email === email)
    if(!identifiedUser){
        throw new HttpError('email is not found',401)
    }
    else if(identifiedUser && identifiedUser.password !== password){
        throw new HttpError('password in invalid!')
    }
    res.json({message:"logged in!"})
};
exports.getAllUser = getAllUser;
exports.signin = signin;
exports.signup = signup;
