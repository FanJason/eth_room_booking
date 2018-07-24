var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongoURI_from_mlab>');

var App = require('./src/js/app');

app.use(express.static('views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var routes = require('./router/routes');
app.use('/', routes);

app.set('views', "views");
app.set('view engine', 'ejs');

app.listen(4000, function() {
  console.log('listening on port 4000');
  App.initWeb3();
});