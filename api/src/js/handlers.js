module.exports = {
    buyEvent: function(error, res) {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log('Token purchase successful!');
            return JSON.stringify(res);
        }
    },

    bookSuccess: function(error, res) {
        if (error) {
            console.log('ERROR ' + error);
        }
        else {
            console.log('Booking Successful');
            return JSON.stringify(res);
        }
    },

    bookFailed: function(error, res) {
        if (error) {
            console.log('ERROR ' + error);
        } else {
            return JSON.stringify(res);
        }
    },

    bookingRemoved: function(error, res) {
        if (error) {
            console.log('ERROR: ' + error);
        } else {
            console.log('Booking Removed');
            console.log(res);
            return JSON.stringify(res);
        }
    },

    blockSuccess: function(error, res) {
        if (error) {
            console.log('ERROR: ' + error);
        } else {
            console.log('Room Blocked');
            console.log(res);
            return JSON.stringify(res);
        }
    },

    unblockSuccess: function(error, res) {
        if (error) {
            console.log('ERROR: ' + error);
        } else {
            console.log("Room Unblocked");
            console.log(res);
            return JSON.stringify(res);
        }
    },

    roomAdded: function(error, res) {
        if (error) {
            console.log('ERROR: ' + error); 
        } else {
            console.log('Room Added!');
            console.log(res);
            console.log("ARGS: " + JSON.stringify(res.args));
            return JSON.stringify(res);
        }
    },

    event: function(error, res) {
        if (error) {
            console.log("ERROR: " + error);
        } else {
            console.log("EVETEL: " + res);
            return JSON.stringify(res);
        }
    }
}