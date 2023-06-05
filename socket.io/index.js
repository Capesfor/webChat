const express = require("express");
const http = require("http");
const app = express();
//const {db} =  require('./db.js');
const server = http.createServer(app);
const socketServ = require("socket.io");
const io = socketServ(server,{cors: {origin: '*',methods: ['GET', 'POST'],}});
const  { connectionToDb } = require('./db.js');
const  { createRooms, deleteRooms, join, getsUsers, sendMsg, creation, checkUser, leave, rename, getServer,disconnect, getUserData } = require ('./dataHandling.js');
//const c = require("config");
let users = {};
let db;
let rooms = ["general"];


connectionToDb().then((res) => {
    db = res;
    console.log("db connected")
}).catch((err) => {
    console.log(err)
})



io.on("connection", socket => {
    creation(socket)
    socket.on("received", () => {
       checkUser(socket)
    })

    socket.on("/list", body => {
      socket.emit("list", getServer(socket) )
      console.log("list", rooms) })

    socket.on("/leave", body => {
      socket.emit("leave", leave(socket, body))
    })

    socket.on("/join", body => {
      console.log("join", body)
      socket.emit("join", join(socket, body))
    })

    socket.on("getUserData", body => {
      console.log("get_user_data", body)
      socket.emit("getUserData", getUserData(socket))
    })

    socket.on("/users", body => {
      console.log("users", body)
      socket.emit("users", getsUsers(socket))
    })

    socket.on("/create", body => {
      //console.log("create", body)
      //console.log("rooms", rooms)
      socket.emit("create", createRooms(socket, body.post))
    })

    socket.on("/delete", body => {
      console.log("delete", body)
      //console.log("delete", deleteRooms(body))
      socket.emit("/delete", deleteRooms(body))
    })

    socket.on("send message", body => {
      //console.log("message", body, users[socket.id])
      sendMsg(body, socket, io)
        //io.to.() emit("message", { user : users[socket.id], msg:body })
    })
    socket.on("rename", name => {
      console.log("rename", name)
      rename(socket, name)
})
    socket.on("disconnect", () => {
      disconnect(socket)
})
})

server.listen(8000, () => console.log(`Listening on port:${8000}}...`));

