"use client";
import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Chat from './components/boxTchat'
import UserList from './components/userList';
import ServerList from './components/serverList';

function useSocket(url : string) {
  const [socket, setSocket] = useState<any>()

  useEffect(() => {
    const socketIo = io("http://localhost:8000",{transports:['websocket']});
    setSocket(socketIo)
    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup
    // should only run once and not on every re-render,
    // so pass an empty array
  }, [])

  return socket;
}



export default function Home() {
  const [input,setInput] = useState("");
  const [userData,setUserData] = useState({});
  const [message,setMessage] = useState([ {user : "SERVER", msg : {post: "welcome to the chat"}}]);
  const socket = useSocket("http://localhost:8000");
  
    
    socket?.on("your id",(data : object) => {
      console.log(data);
      setUserData(data);
      setMessage(data.msg);
    });

  socket?.on("rename",(data: any) => {
    console.log(data);
  });

  if (!socket) {
    return <div>loading...</div>
  }
  return (
    <main className="flex flex-row">

      <div className="w-1/2 pt-7 ">
        <ServerList socket={socket}/>
      </div>

      <div className="w-full p-4 ">
        <Chat socket={socket} message={message} setMessage={setMessage} input={input} setInput={setInput} userData={userData}/>
      </div>

      <div className='w-1/2 pt-7'>
        <UserList socket={socket}/ >
      </div>

    </main>
  )
}
