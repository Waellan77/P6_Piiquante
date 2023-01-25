// import express //
const express = require('express')

// router function //
const router = express.Router()

// import of authentication middleware // 
const auth = require('../middleware/auth')

// import of multer middleware for image file management //
const multer = require('../middleware/multer-config')

// import sauces controllers //
const saucesCtrl = require('../controllers/sauces')

// routes with authentication middleware //
router.get('/', auth, saucesCtrl.getAllSauce)
router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.post('/:id/like', auth, saucesCtrl.likeSauce)

// module export //
module.exports = router