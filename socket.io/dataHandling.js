
let serverDB = {
    users : {},
    rooms : {"general" : {messages : []}},
    id : 0
  }

function rename(socket, name) {
    if (serverDB.users[socket.id] === undefined) {
        return;
    }
    serverDB.users[socket.id].name = name;
    for (let i = 0; i < serverDB.users[socket.id].rooms.length; i++)
      socket.to(serverDB.users[socket.id].rooms[i]).emit("rename");
    return `rename "${name}" : success`;
}

function leave(socket, room ) {
    if (serverDB.rooms.indexOf(room) !== -1) {
        socket.leave(room);
        serverDB.users[socket.id].rooms.splice(serverDB.users[socket.id].rooms.indexOf(room), 1);
        serverDB.users[socket.id].active = "general";
        console.log("leave", serverDB.users[socket.id].rooms)
        return `leave "${room}" : success`;
    }
    return `leave "${room}" : error in the syntax or server does not exist please try again`;
}

function checkUser(socket) {
    if (serverDB.users[socket.id] === undefined) {
        delete serverDB.users[socket.id]
        return;
    }
    //console.log(serverDB.users[socket.id], "received")
}

function creation(socket) {
    if (serverDB.users[socket.id] === undefined) {
        //sers[socket.id] = {name : `user${i}`, room: "general"};
        serverDB.users[socket.id] = {name : `user${serverDB.id}`, rooms: ["general"], active: "general" };
        socket.join("general");
        console.log("user connected", serverDB.users[socket.id], )
        socket.emit("your id", { name : serverDB.users[socket.id].name, id : socket.id , room : serverDB.users[socket.id].active, msg : serverDB.rooms[serverDB.users[socket.id].active].messages});
        serverDB.id++;
    }
}

function createRooms( socket, room) {
    if (serverDB.rooms.indexOf(room) === -1) {
      console.log("createRooms", room)
      //rooms.push(room)
      serverDB.rooms.push(room)
      serverDB.users[socket.id].active = room;
      serverDB.users[socket.id].rooms.push(room);
      socket.join(room);
      return `creation of "${room}" : success`;
    }
    return "error in the syntax or server already exist please try again";
  }
  
  function getServer(socket) {
    return serverDB.users[socket.id].rooms;
  }

  function deleteRooms(room) {
    if (serverDB.rooms.indexOf(room) !== -1) {
      console.log("deleteRooms", room)
      //rooms.splice(rooms.indexOf(room), 1)
      serverDB.rooms.splice(serverDB[rooms].indexOf(room), 1)
      return `deletion of "${room }" success`;
    }
    return `deletion of "${room }" error in the syntax or else please try again`;
  }
  
  function join(socket, room) {
    if (serverDB.rooms.indexOf(room) === -1) {
      return `join "${room}" : error in the syntax or server does not exist please try again`;
    }
    if (serverDB.users[socket.id].active === room) {
      return `join "${room}" : error you are already in this server`;
    }
    serverDB.users[socket.id].rooms.push(room);
    serverDB.users[socket.id].active = room;
    socket.join(room);
  
    console.log("join", rooms)
    return `join "${room}" : success`;
  }
  
  function disconnect(socket) {
    console.log("user disconnected", serverDB.users[socket.id].name)
      socket.broadcast.emit("user disconnected", serverDB.users[socket.id])
      delete serverDB.users[socket.id]
    }

  function getsUsers(userS) {
    let usersInRoom = [];
    for (let user in serverDB.users) {
      if (serverDB.users[user].active === serverDB.users[userS].active) {
        usersInRoom.push(serverDB.users[user].name)
      }
    }
    console.log("getsUsers", usersInRoom)
    return usersInRoom;
  }
  
  
  function sendMsg(msg, socket, io) {
    console.log("sendMsg", msg)
    const message = {user : serverDB.users[socket.id].name, msg:msg}
    serverDB.rooms[serverDB.users[socket.id].active].messages.push(message)
    io.to(serverDB.users[socket.id].active).emit("message", message)
  }

module.exports = { createRooms, deleteRooms, join, getsUsers, sendMsg, creation, checkUser, leave, rename, getServer, disconnect };