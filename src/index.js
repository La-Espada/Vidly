const mongoose =require('mongoose');
const config = require('config');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movie');
const rental = require('./routes/rental')
const users = require('./routes/user');
const auth = require('./routes/auth');
const express = require('express');
const app = express();

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidlyDatabase', { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log('Connected to Vidly Database....'))
.catch(()=>console.log('Couldn t connect to MongoDB...',err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customer',customers);
app.use('/api/movie', movies);
app.use('/api/rental', rental);
app.use('/api/user', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));