// Import express //
const express = require('express')

// Router function //
const router = express.Router()

// Import user controllers //
const userCtrl = require('../controllers/user')

// Routes //
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

// Module export //
module.exports = router