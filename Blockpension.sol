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
    
    function Blockpension(address _address, string _name, uint _contribution, uint _age) payable public {
        User memory newUser = User({
            cryptAddress: msg.sender,
            name: _name,
            contribution: _contribution * 10 ** 18,
            age: _age,
            received: 0
        });
        users.push(newUser);
    }
    
    
    function getPension() public payable {
    }
    
    function returnBalance()public view returns(uint) {
        return this.balance;
    }
    
    function registerRetiredUsers(address _user) public{
        retiredUsers.push(_user);
    }
    
    function sendPension() public {
        uint arrayLength = retiredUsers.length;
        for (uint i=0; i<arrayLength; i++) {
            retiredUsers[i].transfer(amount/2);
        }
    }
    
}
