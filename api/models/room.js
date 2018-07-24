var mongoose = require('mongoose');

var RoomSchema = new mongoose.Schema({
    sellPrice: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    roomID: { 
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    holder: {
        type: String,
        unique: false,
        required: true,
        trim: true
    },
    blocked: {
        type: Boolean,
        unique: false,
        required: true,
        trim: true
    },
    booked: {
        type: Boolean,
        unique: false,
        required: true,
        trim: true
    }
});

var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;