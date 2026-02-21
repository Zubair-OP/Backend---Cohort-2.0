const express = require('express');
const Authrouter = express.Router();
const authcontroller = require('../controller/auth.controller');
const authMiddleware = require("../middleware/auth.middleware")



Authrouter.post("/register",authcontroller.Register)
Authrouter.post("/login", authcontroller.login)
Authrouter.get("/getme",authMiddleware,authcontroller.getme)



module.exports = Authrouter;