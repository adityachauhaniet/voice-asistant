const express = require('express');
const { getList, saveList } = require('../controllers/listController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getList)
    .post(protect, saveList);

module.exports = router;