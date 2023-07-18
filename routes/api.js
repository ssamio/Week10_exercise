var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const validator = require('../auth/validator.js');
const User = require('../models/User');
const Todo = require('../models/Todo');

const emailValidate = () => body('email').isEmail();
const passwordValidate = () => body('password').isStrongPassword({
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
});

router.get('/private', validator, (req, res, next) => {
  res.status(200).json({"email": req.user.email});
});

router.post('/user/login', function(req, res, next){
  User.findOne({email: req.body.email}, (err, user) =>{
    if(err) throw err;
    if(!user){
      return res.status(403).json({message: "Invalid credentials"});
    }
    else{
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          const jwtPayload = {
            email: user.email
          }
          jwt.sign(
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120
            },
            (err, token) => {
              res.json({token});
            }
          );
        }
        else if(!isMatch){
          return res.status(403).json({message: "Invalid credentials"});
        }
      });
    }
  });
});

router.post('/user/register/', passwordValidate(), (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({message: "Password is not strong enough"});
  }
  User.findOne({email: req.body.email}, (err, user) => {
    if(err) throw err;
    if(user){
     return res.status(403).json({message: "Email already in use"}); 
    }
    else{
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if(err){
            throw err;
          }
          User.create({
            email: req.body.email,
            password: hash
          },
          (err, ok) => {
            if(err){
              throw err;
            }
            else{
            return res.status(200).json({success: true});
            }
          });
        });
      });
    }
  });
});
    
router.post('/todos', validator, (req, res, next) => {
  User.findOne({email: req.user.email},  (err, user) => { 
    if (!user){
      return res.status(404).json({message: "User not found"});
    }
    else{
      Todo.findOne({user: user._id}, (err, todos) => {
        if(err) throw err;
        else if(!todos){
          Todo.create({
            user: user._id,
            items: req.body.items
          });
          res.status(200).json({success: true});
        }
        else if(todos){
          const target = todos.items.concat(req.body.items);
          Todo.updateOne({user: todos.user},{
            items: target
          }).exec();
          res.status(200).json({success: true});
        }
      });
    }
  });
});

router.get('/todos', validator, (req, res, next) =>{
  User.findOne({email: req.user.email}, (err, user) =>{
    if (!user){
      return res.status(404).json({message: "User not found"});
    }
    else {
      Todo.find({user: user._id}, (err, todos) => {
        if (err) throw err;
        else if(!todos){
          return res.status(404).json({message: "No todos found for user!"});
        }
        else if(todos){
          return res.status(200).json({list: todos});
        }
      });
    }
  });
});

module.exports = router;
