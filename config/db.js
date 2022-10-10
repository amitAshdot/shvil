const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');  // get the mongoURI from the default.json file
let user;
const connectDB = async (app) => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            // useCreateIndex: true,
        }); // connect to the database
        user = await mongoose.connection.db.listCollections().toArray();
        // app.local.flight = user;
        console.log('MongoDB Connected...');
        return user;
    } catch (err) {
        console.error(err.message);
        process.exit(1); // exit process with failure
    }
}

module.exports = connectDB;
