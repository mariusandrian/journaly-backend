const express = require('express');
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();
app.use(methodOverride('_method'));

app.use(cookieParser('randomsecret'));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true,}));
app.use(cors({ 
    origin: process.env.FRONT_END_URL || 'http://localhost:3000', 
    credentials: true 
}));

app.use(session({ 
    secret: 'randomsecret' ,
    resave: true,
    saveUninitialized: true,

    // cookie : {
    //     sameSite: 'none',
    //     secure: true
    // }
})); // USE SESSION TO LOGIN/LOGOUT
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Routes
require('./router')(app);

if (process.env.NODE_ENV !== 'test') {
    db.connect();
}

const server = app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

module.exports = app;