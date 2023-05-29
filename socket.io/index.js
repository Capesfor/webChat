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

connectionToDb().then((res) => {
    db = res;
    console.log("db connected")
}).catch((err) => {
    console.log(err)
})

function getRooms() {
  let rooms = [];
  for (let key in users) {
    if (rooms.indexOf(users[key].room) === -1) {
      rooms.push(users[key].room)
    }
  }
  return rooms;
}






function sendMsg(msg, userS) {
  console.log("sendMsg", msg, userS)
      io.to(users[userS].room).emit("message", { user : users[userS].name, msg:msg })
}


io.on("connection", socket => {
    if (users[socket.id] === undefined) {
        users[socket.id] = {name : `user${i}`, room: "general"};
        socket.join("general");
        console.log("user connected", users[socket.id], )
        socket.emit("your id", { name : users[socket.id].name, id : socket.id , room : users[socket.id].room});
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
      console.log("list", body)
      socket.emit("list", getRooms())
    })


    socket.on("send message", body => {
      //console.log("message", body, users[socket.id])
      sendMsg(body, socket.id)
        //io.to.() emit("message", { user : users[socket.id], msg:body })
    })
    socket.on("rename", name => {
      console.log("rename", name)
      socket.broadcast.emit("rename", name)
})
    socket.on("disconnect", () => {
      console.log("user disconnected", users[socket.id].name)
      socket.broadcast.emit("user disconnected", users[socket.id])
      delete users[socket.id]
    })
})


server.listen(8000, () => console.log(`Listening on port:${8000}}...`));