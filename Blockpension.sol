pragma solidity ^0.4.17;

contract Blockpension {
    address public user;
    address[] public retiredUsers;
    uint public amount;
    uint public pension;
    User[] public users;
    
    struct User {
        address cryptAddress;
        string name;
        uint contribution;
        uint age;
        uint received; 
    }
    
    function Blockpension(uint _amount) payable public {
        user = msg.sender; 
        amount = _amount * 10 ** 18;
    }
    
    
    function getPension() public payable {
    }
    
    function returnBalance()public view returns(uint) {
        return this.balance;
    }
    
    function registerRetiredUsers() public{
        retiredUsers.push(msg.sender);
    }
    
    function sendPension() public {
        uint arrayLength = retiredUsers.length;
        for (uint i=0; i<arrayLength; i++) {
            retiredUsers[i].transfer(amount);
        }
    }
    
    function createUser(address _address, string _name, uint _contribution, uint _age) public {
        User memory newUser = User({
            cryptAddress: _address,
            name: _name,
            contribution: _contribution,
            age: _age,
            received: 0
        });
        
        users.push(newUser);
    }
    
}
