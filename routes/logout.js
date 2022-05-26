"use strict"
const Controller = require('../controllers/controller')
const express = require("express");
const router = express.Router();

router.get('/', Controller.logOut)

module.exports = router;