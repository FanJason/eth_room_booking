var express = require('express');
var request = require('request');
var router = express.Router();

var User = require('../models/user');

var helper = require('./helpers');
var loginValue = false;

router.get('/', function(req, res) {
  helper.getAPI('getRooms').then(function(rooms) {
    if (rooms[0] == undefined) {
     res.render('index', { tokenValue: 0, login: loginValue, rooms: {} });
    } else {
      var jsonRooms = JSON.parse(rooms);
      if (req.session.userId) {
        helper.getUser(req.session.userId).then(function(user) {
          helper.getAPI('gettokenbalance/' + user.privateKey).then(function(funds) {
            if (loginValue) {
              res.render('index', { tokenValue: funds, login: loginValue, rooms: jsonRooms});
            } else {
              res.render('index', { tokenValue: 0, login: loginValue, rooms: jsonRooms});
            }
          })
        })
      } else {
        loginValue = false;
        res.render('index', { tokenValue: 0, login: loginValue, rooms: jsonRooms});
      }
    }
  })
})

router.get('/buy', function(req, res) {
  if (req.session.userId) {
    res.render('buy', { login: loginValue });
  } else {
    loginValue = false;
    res.redirect('/login');
  }
})

router.post('/buy', function(req, res) {
  if (req.session.userId) {
    helper.getUser(req.session.userId).then(function(user) {
      helper.getAPI('buy/' + req.body.value + '/' + user.privateKey).then(function(body) {
        res.redirect('/');
      })
    })
  } else {
    loginValue = false;
    res.redirect('/login');
  }
})

router.get('/addroom', function(req, res) {
  if (req.session.userId) {
    res.render('addroom', { login: loginValue });
  } else {
    loginValue = false;
    res.redirect('/login');
  }
})

router.post('/addroom', function(req, res) {
  if (req.session.userId) {
    var price = req.body.price;
    var roomID = req.body.roomNum;
    helper.getAPI('addroom/' + price + '/' + roomID).then(function(body) {
      var json = JSON.parse(body);
      var price = json.args.sellPrice;
      var roomID = json.args.room_id;
      var adder = json.args.adder;
      var txHash = json.transactionHash;
      var blockNum = json.blockNumber;
      res.render('roomAdded', {login: loginValue, price: price, roomID: roomID, adder: adder, txHash: txHash, blockNum, blockNum});
    })
  } else {
    loginValue = false;
    res.redirect('/login');
  }
})

router.post('/book/:roomID/', function(req, res) {
  if (req.session.userId) {
    var roomID = req.params.roomID
    helper.getUser(req.session.userId).then(function(user) {
      var address = user.privateKey;
      helper.getAPI('book/' + roomID + '/' + address).then(function(response) {
        res.redirect('/roombooked/' + response);
        //res.send(response);
      })
    })
  } else {
    loginValue = false;
    res.redirect('/login');
  }
})

router.get('/roombooked/:data', function(req, res) {
  var json = JSON.parse(req.params.data);
  console.log(json);
  var roomID = json.args.room_id;
  var user = json.args.booker;
  var event = json.event;
  var txHash = json.transactionHash;
  var blockNum = json.blockNumber;
  res.render('roomBooked', { login: loginValue ,roomID: roomID, user: user, event: event, txHash: txHash, blockNum: blockNum });
})

router.get('/login', function(req, res) {
  res.render('login', { login: loginValue });
})

router.post('/login', function(req, res, next) {
  User.authenticate(req.body.email, req.body.password, function (error, user) {
    if (error || !user) {
      var err = new Error('Wrong email or password.');
      err.status = 401;
      return next(err);
    } else {
      req.session.userId = user._id;
      return res.redirect('/profile');
    }
  });
})

router.get('/signup', function(req, res ) {
  res.render('signup', { login: loginValue });
})

router.post('/signup', function(req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  helper.getAPI('create/' + req.body.passwordConf).then(function(key) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
      privateKey: key
    }
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  })
})

router.get('/profile', function (req, res, next) {
  console.log(req.session.userId);
  
  User.findById(req.session.userId)
    .exec().then(function ( user) {
      console.log('exec');
      console.log(user);
      if (!user) {
        // return next(error);
        return res.redirect('/');
      } else {
        console.log(user);
        request({
          url : 'http://localhost:4000/unlockAccount/',
          method:'POST',
          form: {
            userKey: user.privateKey,
            userPassword: user.passwordConf
          }
        }, function(err, response, body) {
          console.log(body);
          loginValue = true;
          return res.redirect('/');
        })
      }
    });
})

router.get('/logout', function (req, res, next) {

  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      request({
        url : 'http://localhost:4000/lockAccount/',
        method:'POST',
        form: {
          userKey: user.privateKey,
          userPassword: user.passwordConf
        }
      }, function() {
        req.session.destroy(function (err) {
          if(err) return next(err);
          loginValue = false;
          return res.redirect('/');
        })
      })
    }
  });
})

module.exports = router;
