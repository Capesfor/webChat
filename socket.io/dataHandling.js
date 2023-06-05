const { get } = require("config");

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
  console.log(serverDB.users[socket.id].rooms.indexOf(room), "leave")
    if (serverDB.users[socket.id].rooms.indexOf(room)) {
      console.log("leave", room)
        socket.leave(room);
        serverDB.users[socket.id].rooms.splice(serverDB.users[socket.id].rooms.indexOf(room), 1);
        serverDB.users[socket.id].active = "general";
        getServer(socket)
        getsUsers(socket)
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
        socket.emit("your id", { name : serverDB.users[socket.id].name, id : socket.id , active : serverDB.users[socket.id].active, msg : serverDB.rooms[serverDB.users[socket.id].active].messages});
        getsUsers(socket)
        getServer(socket)
        serverDB.id++;
    }
}

function getMessages(socket) {
    console.log("getMessages", serverDB.users[socket.id].active)
    socket.emit("getMessages", serverDB.rooms[serverDB.users[socket.id].active].messages)
}

function createRooms( socket, room) {
    if (serverDB.rooms[room] === undefined) {
      console.log("createRooms", room)
      //rooms.push(room)
      //serverDB.rooms.push(room)
      serverDB.rooms[room] = {messages : []}
      //serverDB.users[socket.id].active = room;

      serverDB.users[socket.id].rooms.push(room);
      socket.join(room);
      getServer(socket)
      return `creation of "${room}" : success`;
    }
    return "error in the syntax or server already exist please try again";
  }
  
  function getServer(socket) {
    console.log("list of server required")
    socket.emit("serverList", serverDB.users[socket.id].rooms);
  }

  function getUserData(socket) {
    console.log("getting data of the user")
    socket.emit("getUserData", serverDB.users[socket.id]);
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
    if (serverDB.rooms[room] === undefined) {
      return `join "${room}" : error in the syntax or server does not exist please try again`;
    }
    if (serverDB.users[socket.id].active === room) {
      return `join "${room}" : error you are already in this server`;
    }
    if(serverDB.users[socket.id].rooms.indexOf(room) === -1)
    serverDB.users[socket.id].rooms.push(room);
  
    serverDB.users[socket.id].active = room;
    socket.join(room);
    getsUsers(socket)
    getMessages(socket)
    getServer(socket)
    getUserData(socket)
    console.log("join", room)
    return `join "${room}" : success`;
  }
  
  function disconnect(socket) {
      let tmp = serverDB.users[socket.id].active
      let usersInRoom = [];
    console.log("user disconnected", serverDB.users[socket.id].name)
      socket.broadcast.emit("user disconnected", serverDB.users[socket.id])
      serverDB.users[socket.id].rooms.forEach(room => {
        socket.leave(room)
        serverDB.rooms[room].messages.push({user : "SERVER", msg : `${serverDB.users[socket.id].name} has left the server`})
      });

      delete serverDB.users[socket.id]

    for (let user in serverDB.users) 
      if (serverDB.users[user].active === tmp) 
        usersInRoom.push(serverDB.users[user].name)

    socket.to(tmp).emit("usersList", usersInRoom)
    console.log("getsUsers in disconnect", usersInRoom)
    }

  function getsUsers(socket) {
    let usersInRoom = [];
    for (let user in serverDB.users) 
      if (serverDB.users[user].active === serverDB.users[socket.id].active) 
        usersInRoom.push(serverDB.users[user].name)
      else
        console.log("function getsUsers", serverDB.users[user].active, serverDB.users[socket.id].active) 
    for (let user of usersInRoom) {
      
    }
    socket.emit("usersList", usersInRoom)
    socket.to(serverDB.users[socket.id].active).emit("usersList", usersInRoom)
    console.log("getsUsers", usersInRoom)
  }
  
  
  function sendMsg(msg, socket, io) {
    console.log("sendMsg", msg)
    const message = {user : serverDB.users[socket.id].name, msg:msg}
    serverDB.rooms[serverDB.users[socket.id].active].messages.push(message)
    io.to(serverDB.users[socket.id].active).emit("message", message)
  }

module.exports = { createRooms, deleteRooms, join, getsUsers, sendMsg, creation, checkUser, leave, rename, getServer, disconnect, getUserData };