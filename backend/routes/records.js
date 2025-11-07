const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { create, list, get, update, remove, bulkDelete } = require('../controllers/recordController');
const { recordValidator } = require('../utils/validators');

router.get('/', auth, list);
router.post('/', auth, recordValidator, create);
router.get('/:id', auth, get);
router.put('/:id', auth, recordValidator, update);
router.delete('/:id', auth, remove);
router.post('/bulk-delete', auth, bulkDelete);
module.exports = router;
