const express = require('express');
const Authrouter = express.Router();
const authcontroller = require('../controller/auth.controller');


Authrouter.post("/register",authcontroller.Register)
Authrouter.post("/login", authcontroller.login)



module.exports = Authrouter;