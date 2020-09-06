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
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use(cookieParser("randomsecret"));
app.use(bodyParser.urlencoded({
    extended: true,
  }));
app.use(bodyParser.json());
app.use(cors({ 
    origin: process.env.FRONT_END_URL || 'http://localhost:3000', 
    credentials: true 
}));
app.use(express.urlencoded({ extended: false }));

// app.set('trust proxy', 1)
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', process.env.FRONT_END_URL || 'http://localhost:3000');
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });
app.use(session({ 
    secret: 'randomsecret' ,
    resave: false,
    saveUninitialized: true,
    cookie : {
        sameSite: 'none',
        secure: false
    }
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