// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract People{

    struct Person{
        string name;
        uint age;
    }

    Person[] public persons;//-------------------------------- exo : array of Person
    Person public moi;

    function modify(string memory _name, uint _age) public {
        moi.name = _name;
        moi.age = _age;
        
        //alt : moi = Person(_name, _age);
    }

    //--------------------------------------------------------- exo : add() and remove()
    function add(string memory _name, uint _age) public {
        Person memory newPerson = Person(_name, _age);
        persons.push(newPerson);

        //alt : persons.push(Person(_name, _age));
    }

    function remove() public {
        persons.pop();
    }   

}