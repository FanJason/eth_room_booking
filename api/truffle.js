module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    
    // test: {
    //   host: "192.168.86.58",
    //   port: 8547,
    //   network_id: "*",
    //   // gas: 100000000000000000000000,
    //   // gasPrice: 100000000000000000000000000000
    // }
  }
};
