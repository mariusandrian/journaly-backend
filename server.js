const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const db = require('./db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');
const { ObjectId } = require('mongodb');

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({ secret: 'randomsecret' })); // USE SESSION TO LOGIN/LOGOUT
app.use(cors({ origin: process.env.FRONT_END_URL || 'http://localhost:3000', credentials: true }));
app.use(express.urlencoded({ extended: false }));

require('./router')(app);

if (process.env.NODE_ENV !== 'test') {
    db.connect();
}

const server = app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

module.exports = app;