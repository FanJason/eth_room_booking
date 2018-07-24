pragma solidity ^0.4.18;

contract Owner {
    address public owner;
    address public owner_2;

    event TransferOwnership(address newOwner);
    event AddOwnership(address newOwner);

    function Owner() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == owner_2);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (msg.sender == owner) {
            owner = newOwner;
        } else {
            owner_2 = newOwner;
        }
        emit TransferOwnership(newOwner);
    }
    
    function addOwnership(address newOwner) public onlyOwner {
        if (owner_2 == 0x0) {
            owner_2 = newOwner;
            emit AddOwnership(newOwner);
        }
    }
}