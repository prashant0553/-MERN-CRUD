const express = require('express');
const router = express.Router();
const { list, create } = require('../controllers/categoryController');
const auth = require('../middleware/auth');

router.get('/', list);
router.post('/', auth, create);
module.exports = router;
