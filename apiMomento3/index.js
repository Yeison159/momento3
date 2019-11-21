const express = require('express');
const session = require('express-session');
// Import Body parser
const bodyParser = require('body-parser');
// Import Mongoose
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
mongoose.set('useFindAndModify', true);
const cors = require('cors')
cookieParser = require('cookie-parser');
// Initialize the index
const app = express();

// Import routes
const apiRoutes = require("./routes/user");
const transaccion = require("./routes/trans");

app.use(cors());
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});
mongoose.connect('mongodb://localhost/billetera', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set('useFindAndModify', false);
let db = mongoose.connection;

app.use(cookieParser());

app.use (session ({
    secret: 'Miclave',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 3000;

app.use('/', apiRoutes);
app.use('/transaccion', transaccion);
// Launch index to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});
