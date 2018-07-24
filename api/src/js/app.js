var Web3 = require('web3');
var handlers = require('./handlers');
var Booking;
var web3Provider;
var web3;
// var Promise = require('bluebird');

module.exports = {
    initWeb3: function () {
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(web3Provider);
        let contract = require("truffle-contract");
        Booking = contract(require('../../build/contracts/Booking.json'));
        Booking.setProvider(web3Provider);

        var account = web3.eth.accounts[0];
        Booking.web3.eth.defaultAccount = account;
    },
        
    create: function(password) {
        return new Promise(function (resolve, reject) {
            web3.personal.newAccount(password, function (error, result) {
                if (error) {
                    console.log('ERROR: ' + error);
                } else {
                    console.log('Private Key' + result);
                    console.log('Password' + password);
                    console.log('Account created!');
                    resolve(result);
                }
            });
        });
    },

    unlockAccount: function(addr, password) {
        return new Promise(function(resolve, reject) {
            resolve(web3.personal.unlockAccount(addr, password));
        })
    },

    lockAccount: function(addr, password) {
        return new Promise(function(resolve, reject) {
            resolve(web3.personal.lockAccount(addr, password));
        })
    },

    initRooms: function () {
        Booking.deployed().then(function (instance) {
            for (i = 0; i < rooms.length; i++) {
                var price = parseInt(rooms[i].sellPrice);
                var roomID = parseInt(rooms[i].roomID);
                var blocked = rooms[i].blocked;
                var booked = rooms[i].booked;

                console.log("BLOCKED: " + blocked);
                console.log("BOOKED: " + booked);

                instance.addRoom.estimateGas(price, roomID).then(function (result) {
                    instance.addRoom(price, roomID, {
                        gas: result + 1000,
                        gasPrice: 0
                    });
                    console.log('Room transaction complete');
                });
            }
        });
    },

    setDefaultAccount: function(address, password) {
        return new Promise(function(resolve, reject) {
            web3.personal.unlockAccount(address, password, 6000);
            resolve(Booking.web3.eth.defaultAccount = address);
        })
    },

    getTokenBalanceAddr: function(address) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function(instance) {
                instance.getTokenBalanceAddr.call(address).then(function(balance) {
                    resolve(balance);
                })
            })
        })
    },

    book: function(_roomid) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function(instance) {

                //BookSuccess listener
                var bookSuccess = instance.Booked();
                bookSuccess.watch(function (error, res) {
                    var res = handlers.bookSuccess(error, res);
                    resolve(res);
                });
    
                //BookFail listener
                var bookFail = instance.BookFailed();
                bookFail.watch(function (error, res) {
                    var res = handlers.bookFailed(error, res);
                    resolve(res);
                });
    
                instance.book(_roomid, {
                    gas: 100000,
                    gasPrice: 0
                });
            });
        });
    },

    removeBooking: function(room_id) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function (instance) {

                //booking removed event listener
                var BookingRemoved = instance.BookingRemoved;
                BookingRemoved.watch(function (error, res) {
                    var res = handlers.bookingRemoved();
                    resolve(res);
                });
    
                instance.removeBooking(room_id);
            });
        });
    },

    block: function (room_id) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function (instance) {
                //Event success listener
                var BlockSuccess = instance.BlockSuccess;
                BlockSuccess.watch(function (error, res) {
                    var res = handlers.blockSuccess(error, res);
                    resolve(res);
                });
                if (room_id == undefined) {
                    instance.blockAllRooms();
                }
                else {
                    instance.blockRoom(room_id);
                }
            });
        });
    },

    unblock: function(room_id) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function (instance) {

                //Event success listener
                var UnblockSuccess = instance.UnblockSuccess();
                UnblockSuccess.watch(function (error, res) {
                    var res = handlers.unblockSuccess(error, res);
                    resolve(res);
                });
                if (room_id == undefined) {
                    instance.unblockAllRooms();
                } else {
                    instance.unblockRoom(room_id);
                }
            });
        })
    },

    addRoom: function(sellPrice, room_id) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function (instance) {
                //roomAdded event listener
                var RoomAdded = instance.RoomAdded();
                RoomAdded.watch(function (error, res) {
                    var res = handlers.roomAdded(error, res);
                    resolve(res);
                });
                instance.addRoom.estimateGas(sellPrice, room_id).then(function(result) {
                    instance.addRoom(sellPrice, room_id, {
                        gas: result,
                        gasPrice: 0
                    });
                });
            });
        });
    },

    getRooms: function() {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function(instance) {
                var roomList = [];
                var roomLength = 0;
                instance.getRoomsLength().then(function(length) {
                    console.log("LENGTH: " + length);
                    roomLength = length;
                    if (roomLength == 0) {
                        resolve();
                    } else {
                        for (var i = 0; i < length; i++) {
                            instance.getRoomByIndex(i).then(function(roomid) {
                                console.log('ROOMID: ' + roomid);
                                instance.getRoom(roomid).then(function(room) {
                                    var roomData = {
                                        price: room.toString().split(',')[0],
                                        roomID: room.toString().split(',')[1],
                                        holder: room.toString().split(',')[2],
                                        blocked: room.toString().split(',')[3],
                                        booked: room.toString().split(',')[4]
                                    }
                                    roomList.push(roomData);
                                    if (roomList.length == roomLength) {
                                        resolve(roomList);
                                    }
                                });
                            })
                        }
                    }
                })
            })
        })
    },

    buy: function(value, addr) {
        return new Promise(function(resolve, reject) {
            Booking.deployed().then(function(instance) {
                var buyEvent = instance.Buy();
                buyEvent.watch(function(error, res) {
                    handlers.buyEvent(error, res);
                });
                instance.buy(value, {
                    gasPrice: 0,
                    from: addr
                }).then(function(response) {
                    resolve(response);
                })
            })
        })
    }
}