const express = require('express');
const router = express.Router();


// @route   GET api/ticket
// @desc    Test route
// @access  Public
router.get('/', (req, res) => { res.send('Ticket route') });

module.exports = router;