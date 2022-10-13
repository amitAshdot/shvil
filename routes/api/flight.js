const express = require('express');
const router = express.Router();
const Flight = require('../../models/Flight');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

// @route   GET api/flight/me
// @desc    Get current users flights
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const flights = await Flight.find({ user: req.user.id }).sort({ date: -1 });
        if (!flights) {
            return res.status(400).json({ msg: 'There are no flights for this user' });
        }
        res.json(flights);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route   GET api/flight/
// @desc    Get single flight
// @access  public
router.get('/:tripNumber', async (req, res) => {
    const { tripNumber } = req.params;
    console.log("req.params: ", tripNumber);
    console.log("req.body: ", req.body);

    try {
        // const flight = await Flight.findById(req.params.id);
        let flight = await Flight.findOne({ tripNumber: tripNumber.toUpperCase() });
        if (!flight) {
            return res.status(400).json({ msg: '12Flight not found' });
        }
        res.json(flight);
    }
    catch (err) {
        console.error(err.message);
        if (err) {
            return res.status(400).json({ msg: 'Flight not found' });
        }
        res.status(500).send('Server Error');
    }
});


// @route   GET api/flight/
// @desc    Get all flights
// @access  public
router.get('/', async (req, res) => {
    try {
        const flights = await Flight.find().sort({ date: -1 });
        if (!flights || flights.length === 0) {
            return res.status(400).json({ msg: 'There are no flights' });
        }
        res.json(flights);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/flight
// @desc    Create or Update user flight
// @access  Private
router.post('/',
    [
        auth,
        [
            check('tripNumber', 'tripNumber is required').not().isEmpty(),
            check('pdfFiles', 'Please add PDF files').not().isEmpty(),
            check('tripDate', 'Please enter flight date').not().isEmpty()
        ]
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { tripNumber, pdfFiles, tripDate, passengers, filesNames } = req.body;

        // Build flight object
        const flightFields = {};
        flightFields.user = req.user.id;
        if (passengers) flightFields.passengers = passengers;
        if (tripNumber) flightFields.tripNumber = tripNumber;
        if (pdfFiles) {
            flightFields.pdfFiles = { pdfFiles };
        }
        if (filesNames) flightFields.filesNames = filesNames;
        if (tripDate) flightFields.tripDate = tripDate;

        try {
            let flight = new Flight(flightFields);
            await flight.save();
            return res.json(flight);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


// @route   Put api/flight
// @desc    Update flight
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { tripNumber, pdfFiles, tripDate, passengers, filesNames } = req.body;
    // Build flight object
    const flightFields = {};
    flightFields.user = req.user.id;
    if (passengers) flightFields.passengers = passengers;
    if (tripNumber) flightFields.tripNumber = tripNumber;
    if (pdfFiles) flightFields.pdfFiles = pdfFiles;
    if (filesNames) flightFields.filesNames = filesNames;
    if (tripDate) flightFields.tripDate = tripDate;

    try {
        // let flight = await Flight.findById(req.params.id);
        let flight = await Flight.findOne({ tripNumber: tripNumber.toUpperCase() });
        console.log(req.params.id)
        if (!flight) return res.status(404).json({ msg: 'Flight not found' });
        if (flight.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        flight = await Flight.findOneAndUpdate(req.params.id, { $set: flightFields }, { new: true });
        res.json(flight);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/flight
// @desc    Update flight
// @access  Public
router.delete('/:id', auth, async (req, res) => {
    try {
        let flight = await Flight.findById(req.params.id);
        if (!flight) return res.status(404).json({ msg: 'Flight not found' });
        if (flight.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await Flight.findOneAndRemove(req.params.id);
        res.json({ msg: 'Flight removed' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;