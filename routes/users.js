const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const { db, User } = require('../config/database');
const Op = Sequelize.Op;



module.exports = router;