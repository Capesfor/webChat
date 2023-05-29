"use client";
import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
function useSocket(url : string) {
  const [socket, setSocket] = useState<any>(null)

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
  const [name,setName] = useState("");
  const [id,setId] = useState("");
  const [message,setMessage] = useState([]);
  const socket = useSocket("http://localhost:8000");
  
  const handlepost = () =>{
    
    if(name.includes("/nick")){
      socket.emit("rename",{post:name});
      return;
  };
  //const post = {post:name};
    setMessage([...message,{user : id, msg: {post:name} }]);
    socket.emit("send message",{post:name});
    setName("");
  };
    
    socket?.on("your id",(data: { name: React.SetStateAction<string>; }) => {
      console.log(data);
      setId(data.name);
    });

  socket?.on("rename",(data: any) => {
    console.log(data);
  });

  socket?.on("message",(data: any) => {
    setMessage([...message,data]);
    socket?.emit("received");
  });
  return (
    <div>
      <input type="text" value={name} className="text-black"onChange={(e)=> setName(e.target.value)} /> 
      <button onClick={handlepost}>Send massage </button>
      <p>Receive message {id}</p>
      {message.map((p,index)=>(
        <li key={index}>from {p.user} : {p.msg.post}</li>
      ))}
    </div>
  )
}
