const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const api = require('./routes');
const config = require('./config/keys');
const dotenv = require('dotenv');
const app = express();

// set cors origin
app.use(
  cors({
    origin: '*',
  }),
);

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

dotenv.config();

app.use('/api', api);

// DB Config
const mongoURI = config.mongoURI;
// Connect to MongoDB
mongoose
.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


  // set port
const port = config.port;
app.listen(port, () => console.log(`Server running on port ${port}`));
