var Booking = artifacts.require("Booking");

module.exports = function(deployer) {
    deployer.deploy(Booking)
    
    .then(() => console.log("CONTRACT ADDRESS: " + Booking.address));
};