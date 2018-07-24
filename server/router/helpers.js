var request = require('request');
var API = 'http://localhost:4000/';
var User = require('../models/user');

module.exports = {
    getUser: function(userId) {
        return new Promise(function(resolve, reject) {
          User.findById(userId)
          .exec(function(err, user) {
            console.log("USER IN GET: " + user);
            resolve(user);
          })
        })
      },
      
      getAPI: function(req) {
        return new Promise(function(resolve, reject) {
          request({
            url: API + req,
            method: 'GET'
          },function(err, response, body) {
            if (err) {
              console.log("ERROR: " + err);
            } else {
              resolve(body);
            }
          });
        })
      },
      
      postAPI: function(req) {
        return new Promise(function(resolve, reject) {
          request({
            url : 'http://localhost:4000/asd',
            method:'POST',
            form: {
              data: JSON.stringify({msg:'hi'})
            }
          }, function(err, response, body) {
            console.log(body);
          })
        })
      }
}