const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const tradeController = require('../controllers/tradeController');
const authController = require('../controllers/authController');

// Items
router.post('/items/create', itemController.createItem);
router.get('/items', itemController.getItems);
router.get('/items/:id', itemController.getItemById);
router.delete('/items/:id', itemController.deleteItem);

// Trades
router.post('/trades/request', tradeController.requestTrade);
router.get('/trades', tradeController.getTrades);
router.put('/trades/:id', tradeController.updateTradeStatus);

// Auth (Face Unlock)
router.post('/auth/unlock', authController.faceUnlock);
router.post('/auth/register', authController.registerFace);

module.exports = router;
