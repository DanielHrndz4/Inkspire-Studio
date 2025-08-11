const express = require('express');
const router = express.Router();
const {create, login} = require('../controllers/user.controller');
const { isNotEmpty } = require('../middlewares/login.middleware');

router.post('/register', create);
router.post('/login', isNotEmpty, login)

module.exports = router;