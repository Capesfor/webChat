const express = require("express");
const http = require("http");
const app = express();
//const {db} =  require('./db.js');
const server = http.createServer(app);
const socketServ = require("socket.io");
const io = socketServ(server,{cors: {origin: '*',methods: ['GET', 'POST'],}});
const  { connectionToDb } = require('./db.js');
let users = {};
let i = 0;
let db;
let rooms = {"general" : []};

connectionToDb().then((res) => {
    db = res;
    console.log("db connected")
}).catch((err) => {
    console.log(err)
})







function sendMsg(msg, user) {

  for (let key in users) {
    if (key !== user && users[key].room === users[user].room) {
      io.to(key).emit("message", { user : users[user].name, msg:msg })
    }
  }

}


io.on("connection", socket => {
    if (users[socket.id] === undefined) {
        users[socket.id] = {name : `user${i}`, room: "general"};
        rooms["general"].push(users[socket.id].name)
        console.log("user connected", users[socket.id], )
        socket.emit("your id", { name : users[socket.id].name, id: socket.id });
        i++;
    }
    socket.on("received", () => {
        if (users[socket.id] === undefined) {
            delete users[socket.id]
            return;
        }
        console.log(users[socket.id], "received")
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