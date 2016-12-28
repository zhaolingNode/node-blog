var express = require('express');
var router = express.Router();

router.use('/profile', require('./profile'));
router.use('/post', require('./post'));
router.use('/password', require('./password'));
module.exports = router;
