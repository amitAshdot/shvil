const express = require('express');
const connectDB = require('./config/db');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/tickets', require('./routes/api/tickets'));
app.use('/api/flight', require('./routes/api/flight'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => { res.send('  API Running  ') });

app.listen(PORT, () => { console.log(`server started on port ${PORT}`) });