var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://jf7776:temp123@ds121190.mlab.com:21190/usersdb123');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: db
  },
),
  expires: new Date(Date.now() + (30 * 86400 * 1000)),
  cookie: {
    httpOnly: false, 
    maxAge: 10000000 
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('views'));

var routes = require('./router/routes');
app.use('/', routes);

app.set('views', "views");
app.set('view engine', 'ejs');

app.listen(3000, function() {
    console.log("listening on port 3000")
})