pragma solidity ^0.4.18;

import "./Token.sol";

contract Booking is Token {
    
    struct Room {
        uint _sellPrice;
        uint _roomID;
        address holder;
        bool blocked;
        bool booked;
    }

    //_roomID => Room, null if no one has booked it
    mapping (uint => Room) public roomMap;

    //list of room ID's
    uint[] public rooms;

    event Booked (
        uint room_id, address booker
    );

    event BookFailed (
        uint room_id, address booker
    );

    event BookingRemoved (
        uint room_id, address booker
    );

    event BlockSuccess (
        address sender
    );

    event UnblockSuccess (
        address sender
    );

    event RoomAdded (
        uint sellPrice, uint room_id, address adder
    );

    event Lit (
        uint[] rooms
    );
    
    //Constructor
    function Booking() public {
        owner = msg.sender;
    }

    function getRoom(uint room_id) public view returns (uint, uint, address, bool, bool) {
        Room storage room = roomMap[room_id];
        return (room._sellPrice, room._roomID, room.holder, room.booked, room.blocked);
    }
    
    function getRoomByIndex(uint index) public view returns (uint) {
        return rooms[index];
    }

    function temp(uint index) public view returns (uint) {
        Room storage room = roomMap[rooms[index]];
        return room._roomID;
    }

    function getRoomsLength() public view returns (uint) {
        return rooms.length;
    }

    function getBookedRooms() public view returns (uint[]) {
        uint[] storage roomList;
        for (uint i = 0; i < rooms.length; i++) {
            bool booked = roomMap[rooms[i]].booked;
            if (booked) {
                roomList.push(rooms[i]);
            }
        }
        return roomList;
    }
    //notBooked(room_id) notBlocked(room_id)
    //Book a room if empty, send BookFailed otherwise
    function book(uint room_id) public {
        uint price = roomMap[room_id]._sellPrice;
        if (balanceOf[msg.sender] >= price &&
         !roomMap[room_id].booked &&
         !roomMap[room_id].blocked) {
            balanceOf[msg.sender] -= price;
            roomMap[room_id].holder = msg.sender;
            roomMap[room_id].booked = true;
            emit Booked(room_id, msg.sender);
        } else {
            emit BookFailed(room_id, msg.sender);
        }
    }
    
    //Cancel a room booking
    function removeBooking(uint room_id) public {
        address holder = roomMap[room_id].holder;
        require(msg.sender == holder);
        roomMap[room_id].holder = 0x0;
        roomMap[room_id].booked = false;
        emit BookingRemoved(room_id, holder);
    }

    //Add a room to the list of available rooms
    function addRoom(uint sellPrice, uint room_id) public {
        Room storage newRoom = roomMap[room_id];
        newRoom._sellPrice = sellPrice;
        newRoom._roomID = room_id;
        newRoom.blocked = false;
        newRoom.booked = false;        
        rooms.push(room_id);
        roomMap[room_id] = newRoom;
        emit RoomAdded(sellPrice, room_id, msg.sender);
    }

    //Prevent users from booking a certain room
    function blockRoom(uint room_id) onlyOwner public {
        roomMap[room_id].blocked = true;
        emit BlockSuccess(msg.sender);
    }

    function unblockRoom(uint room_id) onlyOwner public {
        roomMap[room_id].blocked = false;
        emit UnblockSuccess(msg.sender);
    }

    function blockAllRooms() onlyOwner public {
        for (uint i = 0; i < rooms.length; i++) {
            roomMap[rooms[i]].blocked = true;
        }
        emit BlockSuccess(msg.sender);
    }

    function unblockAllRooms() onlyOwner public {
        for (uint i = 0; i < rooms.length; i++) {
            roomMap[rooms[i]].blocked = false;
        }
        emit UnblockSuccess(msg.sender);
    }
}