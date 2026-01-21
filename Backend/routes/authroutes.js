const express = require('express');
const {login, logout, signup} = require('../controllers/authcontrollers');
const router = express.Router();

router.post('/signup',signup);

router.post('/login', login);

router.post('/logout',logout);


module.exports = router;