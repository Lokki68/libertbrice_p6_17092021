const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

// Create Sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Modify Sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Delete Sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// GetAll Sauce
router.get('/', auth, multer, sauceCtrl.getAllSauce);

// GetOne Sauce
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);

// Like Sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;
