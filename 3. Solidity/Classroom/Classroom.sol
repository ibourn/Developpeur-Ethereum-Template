// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.20;

/*statement: implement addNote, getNote, setNote, calculate averages according to the imposed structure*/

/*personal reminder : about 1h + 30 min correction*/
contract Classroom is Ownable {
    enum Subject {BIOLOGY, MATH, FR}

    //specified constraint
    /*notes will be stored and returned with more digits than inputs (see MULTIPLIER)*/
    struct Student {
        string name;
        uint noteBiology;
        uint noteMath;
        uint noteFr;
    }
    //specified constraints
    address biologyProf;
    address mathProf;
    address frProf;
    /*as we compute averages, i store notes*multiplier in order to get more precision
    when returning averages i let the frontend reformat the output*/
    uint constant MULTIPLIER = 100;

    Student[] students;
    /*Ids = students index + 1 It allows to check valid students (non extisting students have Ids = 0,
    the uint default value)*/
    mapping(address => uint) private studentsIds;

    modifier onlyValidSubject(Subject _subject) {
        require(
            _subject == Subject.BIOLOGY ||
            _subject == Subject.MATH ||
            _subject == Subject.FR,
            "Subject not valid.");
        _;
    }

    modifier onlyValidProf(Subject _subject) {
        require(
            (msg.sender == biologyProf && _subject == Subject.BIOLOGY) ||
            (msg.sender == mathProf && _subject == Subject.MATH) ||
            (msg.sender == frProf && _subject == Subject.FR),
            "Only valid teachers can set notes in their subject.");
        _;
    }

    modifier onlyValidStudent(address _student) {
        require(studentsIds[_student] != 0, "Student not valid.");
        _;
    }

    /* addresses are specified as hardcoded, we use the constructor to set them 
    for testing purposes */
    constructor(address _biologyProf, address _mathProf, address _frProf) {
        biologyProf = _biologyProf;
        mathProf = _mathProf;
        frProf = _frProf;
    }

    function getNote(
        address _student,
        Subject _subject
    ) public view onlyValidSubject(_subject) onlyValidStudent(_student) returns(uint) {

        Student memory student = students[_getStudentId(_student)];

        if (_subject == Subject.BIOLOGY) {
            return student.noteBiology;
        } else if (_subject == Subject.MATH) {
            return student.noteMath;
        } else {
            return student.noteFr;
        }
    }

    function setNote(
        address _student,
        Subject _subject,
        uint _note
    ) public onlyValidProf(_subject) onlyValidStudent(_student) {
        Student storage student = students[_getStudentId(_student)];
        uint convertedNote = _formatInputNote(_note);
        if (_subject == Subject.BIOLOGY) {
            student.noteBiology = convertedNote;
        } else if (_subject == Subject.MATH) {
            student.noteMath = convertedNote;
        } else {
            student.noteFr = convertedNote;
        }
    }


    /*uncertain about the logic of this function as we have setNote,
    I assume it means adding a note to the current one, and then dividing by 2.
    Checks will be made by getNote*/
    function addNote(
        address _student,
        Subject _subject,
        uint _note
    ) external {
        uint note = getNote(_student,_subject);
        uint convertedNote = _formatInputNote(_note);

        uint newnote = note == 0 ? convertedNote : (note + convertedNote) / 2;

        setNote(_student, _subject, newnote);
    }

    function addStudent(
        address _student,
        string memory _name
    ) external onlyOwner {
        require(studentsIds[_student] == 0, "Student already added.");
        students.push(Student(_name, 0, 0, 0));
        studentsIds[_student] = students.length - 1;
    }

    function getStudentAverage(address _student) external view onlyValidStudent(_student) returns(uint) {
        Student memory student = students[_getStudentId(_student)];

        return (student.noteBiology + student.noteMath + student.noteFr) / 3;
    }

    function getClassAverageBySubject(Subject _subject) external view onlyValidSubject(_subject) returns(uint) {
        if (_subject == Subject.BIOLOGY) {
            return _getClassAverageInBiology();
        } else if (_subject == Subject.MATH) {
            return _getClassAverageInMath();
        } else {
            return _getClassAverageInFr();
        }
    }

    function getClassAverage() external view returns(uint) {
        uint total = _getClassAverageInBiology() + _getClassAverageInMath() + _getClassAverageInFr();
        return total / 3;
    }

    /*helper for the FE to call functions with a subject*/
    function getSubjects() external pure returns(Subject[] memory) {
        Subject[] memory subjects = new Subject[](3);
        subjects[0] = Subject.BIOLOGY;
        subjects[1] = Subject.MATH;
        subjects[2] = Subject.FR;
        return subjects;
    }

    function _formatInputNote(uint note) private pure returns(uint) {
        return note * MULTIPLIER;
    }

    function _getStudentId(address _student) private view onlyValidStudent(_student) returns(uint) {
        return studentsIds[_student] - 1;
    }

    function _getClassAverageInBiology() private view returns(uint) {
        uint total = 0;
        for (uint i = 0; i < students.length; i++) {
            total += students[i].noteBiology;
        }
        return total / students.length;
    }

    function _getClassAverageInMath() private view returns(uint) {
        uint total = 0;
        for (uint i = 0; i < students.length; i++) {
            total += students[i].noteMath;
        }
        return total / students.length;
    }

    function _getClassAverageInFr() private view returns(uint) {
        uint total = 0;
        for (uint i = 0; i < students.length; i++) {
            total += students[i].noteFr;
        }
        return total / students.length;
    }

}
     
     
