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
  const [input,setInput] = useState("");
  const [userData,setUserData] = useState({});
  const [message,setMessage] = useState([]);
  const socket = useSocket("http://localhost:8000");
  
  const handlepost = () =>{
    if(input.includes("/nick")){
      socket.emit("rename",{post:input});
      setInput("");
      return;
    };
    if(input.includes("/list")){
    console.log("lsg")
    socket.emit("/list");
    setInput("");
    return;
  };
  
  //const post = {post:input};
    //setMessage([...message,{user : id, msg: {post:input} }]);
    socket.emit("send message",{post:input});
    setInput("");
  };
    
    socket?.on("your id",(data: { input: React.SetStateAction<string>; }) => {
      console.log(data);
      setUserData(data);
    });

  socket?.on("rename",(data: any) => {
    console.log(data);
  });

  socket?.on("list",(data: any) => {
    let tmp = "";
      for (let i = 0; i < data.length; i++) {
        tmp += data[i] + "\n";
    }
    setMessage([...message,{user : "server", msg : {post: tmp}}]);
    console.log(data);
  });


  socket?.on("message",(data: any) => {
    //console.log(data);
    setMessage([...message,data]);
    socket?.emit("received");
  });
  return (
    <div>
      <input type="text" value={input} className="text-black"onChange={(e)=> setInput(e.target.value)} /> 
      <button onClick={handlepost}>Send massage </button>
      <p>HI {userData.name} your are now in {userData.room}</p>
      {message.map((p,index)=>(
        <li key={index}>from {p.user} : {p.msg.post}</li>
      ))}
    </div>
  )
}
