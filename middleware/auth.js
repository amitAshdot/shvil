const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Get the token from the header
    const token = req.header('x-auth-token');

    //Check if not token
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' })

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); //Verify the token
        req.user = decoded.user; //Set the user to the decoded user
        next(); //Move on to the next middleware
    }
    catch (err) {
        res.status(401).json({ msg: 'token is not valid!' });
    }
}