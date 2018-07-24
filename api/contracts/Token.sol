pragma solidity ^0.4.18;

import "./Owner.sol";

contract Token is Owner {
    uint256 public totalSupply;
    uint public INITIAL_SUPPLY = 0;

    mapping (address => uint256) public balanceOf;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event NoCash(uint _value, address _sender);
    event Buy(uint _value, address _by);
    event Burn(address account, uint _value);

    function Token() public {
        totalSupply = INITIAL_SUPPLY;
        balanceOf[owner] = INITIAL_SUPPLY;
    }

    function getTokenBalance() public view returns (uint256) {
        return balanceOf[msg.sender];
    }

    function getTokenBalanceAddr(address account) public view returns (uint256) {
        return balanceOf[account];
    }

    function buy(uint _value) public {
        balanceOf[msg.sender] += _value;
        emit Buy(_value, msg.sender);
    }

    function _transfer(address _from, address _to, uint256 _value) public {
        require(balanceOf[_from] >= _value);           
        require(balanceOf[_to] + _value >= balanceOf[_to]);  
        balanceOf[_from] -= _value;                 
        balanceOf[_to] += _value;                            
        emit Transfer(_from, _to, _value);  
    }

    function transfer(address _to, uint256 _value) public {
        _transfer(msg.sender, _to, _value);
    }

    function mint(address _to, uint256 _value) onlyOwner public returns (bool) {
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        balanceOf[_to] += _value;
        totalSupply += _value;
        return true;
    }

    function burn(uint256 _value) onlyOwner public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
        return true;
    }
}