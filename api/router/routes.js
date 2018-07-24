var express = require('express');
var router = express.Router();

var Room = require('../models/room');
var App = require('../src/js/app');

router.get('/create/:password', function(req, res) {
  App.create(req.params.password).then(function(privateKey) {
    res.end(privateKey);
  })
});

router.post('/unlockaccount', function(req, res) {
  var addr = req.body.userKey;
  var pass = req.body.userPassword;
  App.unlockAccount(addr, pass).then(function() {
    res.end('account unlocked');
  })
})
router.post('/lockaccount', function(req, res) {
  var addr = req.body.userKey;
  var pass = req.body.userPassword;
  App.lockAccount(addr, pass).then(function() {
    res.end('account locked');
  })
})

router.get('/buy/:value/:address', function(req, res) {
    const value = req.params.value;
    var addr = req.params.address;
    App.buy(value, addr).then(function(response) {
      res.end(JSON.stringify(response));
    });
});

router.get('/gettokenbalance/:address', function(req, res) {
;  var address = req.params.address;
  App.getTokenBalanceAddr(address).then(function(balance) {
    res.end(JSON.stringify(JSON.parse(balance)));
  })
});

router.get('/getrooms', function(req, res) {
  App.getRooms().then(function(result) {
    res.end(JSON.stringify(result));
  })
})

router.get('/addroom/:price/:roomNum', function(req, res) {
    var sellPrice = req.params.price;
    var room_id = req.params.roomNum;
    App.addRoom(sellPrice, room_id).then(function(response) {
      console.log(response);

      var roomData = {
        sellPrice: req.params.price,
        roomID: req.params.roomNum,
        holder: '0x0000000000000000000000000000000000000000',
        blocked: false,
        booked: false
      }

      Room.create(roomData, function(error) {
        if (error) { 
          return next(error);
        } else { 
          console.log("ROOM STORED");
          res.end(response);
        }
      })
    });
});

router.get('/book/:_roomid/:address', function(req, res) {
    var _roomid = req.params._roomid;
    App.book(_roomid).then(function(response) {
      var address = req.params.address;
      if (JSON.parse(response).event == "BookFailed") {
        res.end(response);
      } else {
        Room.findOneAndUpdate({ "roomID": _roomid }, { "holder": address }, { "booked": true }, function(error, room) {
          if (error) {
            return next(error);
          } else {
            console.log("ROOM: " + room);
            res.end(response);
          }
        })
      }
    });
});

module.exports = router;