const express = require("express");
const http = require("http");
const app = express();
//const {db} =  require('./db.js');
const server = http.createServer(app);
const socketServ = require("socket.io");
const io = socketServ(server,{cors: {origin: '*',methods: ['GET', 'POST'],}});
const  { connectionToDb } = require('./db.js');
//const c = require("config");
let users = {};
let i = 0;
let db;
let rooms = ["general"];
let serverDB = {
  users : {},
  messages : [],
  rooms : ["general"],
  id : 0
}

connectionToDb().then((res) => {
    db = res;
    console.log("db connected")
}).catch((err) => {
    console.log(err)
})

function createRooms(room) {
  if (rooms.indexOf(room) === -1) {
    console.log("createRooms", room)
    //rooms.push(room)
    serverDB[rooms].push(room)
    return `creation of "${room}" : success`;
  }
  return "error in the syntax or server already exist please try again";
}

function deleteRooms(room) {
  if (server.dbrooms.indexOf(room) !== -1) {
    console.log("deleteRooms", room)
    //rooms.splice(rooms.indexOf(room), 1)
    serverDB.rooms.splice(serverDB[rooms].indexOf(room), 1)
    return `deletion of "${room }" success`;
  }
  return `deletion of "${room }" error in the syntax or else please try again`;
}

function join(userS, room) {
  if (serverDB.rooms.indexOf(room) === -1) {
    return `join "${room}" : error in the syntax or server does not exist please try again`;
  }
  if (users[userS].room === room) {
    return `join "${room}" : error you are already in this server`;
  }
  users[userS].room = room;

  console.log("join", rooms)
  return `join "${room}" : success`;
}

function getsUsers(userS) {
  let usersInRoom = [];
  for (let user in serverDB.users) {
    if (serverDB.users[user].room === serverDB.users[userS].room) {
      usersInRoom.push(serverDB.users[user].name)
    }
  }
  console.log("getsUsers", usersInRoom)
  return usersInRoom;
}





function sendMsg(msg, userS) {
  console.log("sendMsg", msg, userS)
      io.to(serverDB.users[userS].room).emit("message", { user : serverDB.users[userS].name, msg:msg })
}


io.on("connection", socket => {
    if (users[socket.id] === undefined) {
        //sers[socket.id] = {name : `user${i}`, room: "general"};
        serverDB.users[socket.id] = {name : `user${i}`, room: "general"};
        socket.join("general");
        console.log("user connected", serverDB.users[socket.id], )
        socket.emit("your id", { name : serverDB.users[socket.id].name, id : socket.id , room : serverDB.users[socket.id].room});
        i++;
    }
    socket.on("received", () => {
        if (users[socket.id] === undefined) {
            delete users[socket.id]
            return;
        }
        console.log(users[socket.id], "received")
    })

    socket.on("/list", body => {
      console.log("list", rooms)
      socket.emit("list", rooms)
    })

    socket.on("/leave", body => {
      console.log("leave", rooms)
      users[socket.id].room = "general";
      socket.emit("leave", "back to general")
    })

    socket.on("/join", body => {
      console.log("join", body)
      socket.emit("join", join(socket.id, body.post))
    })

    socket.on("/users", body => {
      console.log("users", body)
      socket.emit("users", getsUsers(socket.id))
    })

    socket.on("/create", body => {
      //console.log("create", body)
      //console.log("rooms", rooms)
      socket.emit("create", createRooms(body.post))
    })

    socket.on("/delete", body => {
      console.log("delete", body)
      //console.log("delete", deleteRooms(body))
      socket.emit("/delete", deleteRooms(body))
    })

    socket.on("send message", body => {
      //console.log("message", body, users[socket.id])
      serverDB.messages.push({user : serverDB.users[socket.id].name, msg:body})
      sendMsg(body, socket.id)
        //io.to.() emit("message", { user : users[socket.id], msg:body })
    })
    socket.on("rename", name => {
      console.log("rename", name)
      socket.broadcast.emit("rename", name)
})
    socket.on("disconnect", () => {
      console.log("user disconnected", serverDB.users[socket.id].name)
      socket.broadcast.emit("user disconnected", serverDB.users[socket.id])
      delete serverDB.users[socket.id]
    })
})


server.listen(8000, () => console.log(`Listening on port:${8000}}...`));

