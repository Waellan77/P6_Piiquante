// Import express //
const express = require('express')

// Router function //
const router = express.Router()

// Import of authentication middleware // 
const auth = require('../middleware/auth')

// Import of multer middleware for image file management //
const multer = require('../middleware/multer-config')

// Import sauces controllers //
const saucesCtrl = require('../controllers/sauces')

// Routes //
router.get('/', auth, saucesCtrl.getAllSauce)
router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.post('/:id/like', auth, saucesCtrl.likeSauce)

// Module export //
module.exports = router