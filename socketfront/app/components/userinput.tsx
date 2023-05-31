import { useState } from "react";
import { Socket } from "socket.io-client";

export default function UserInput({socket,message,setMessage,input, setInput}: {socket: Socket,message: any,setMessage: any,input : any , setInput : any}) {

    const  mySplit = (input: string) => {
        let tmp = input.split(" ");
            if (tmp.length != 2) {
              setMessage([...message,{user : "server", msg : {post: "error to many or few arguments"}}]);
              return "";
            }
            return tmp[1];
      }

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
        if(input.includes("/create")){
          let tmp = input.split(" ");
          if (tmp.length != 2) {
            setMessage([...message,{user : "server", msg : {post: "error to many or few arguments"}}]);
            return;
          }
          console.log("lsg")
          socket.emit("/create",{post:tmp[1]});
          setInput("");
          return;
        };
    
        if(input.includes("/delete")){
          socket.emit("/delete",{post:input});
          setInput("");
          return;
        };
    
        if(input.includes("/leave")){
          socket.emit("/leave",{post:input});
          setInput("");
          return;
        };
    
        if(input.includes("/users")){
          socket.emit("/users");
          setInput("");
          return;
        };
    
        if(input.includes("/join")){
          let tmp = mySplit(input);
          if (tmp == "")
            return;
          socket.emit("/join",{post:tmp});
          setInput("");
          return;
        };
      
      //const post = {post:input};
        //setMessage([...message,{user : id, msg: {post:input} }]);
        socket.emit("send message",{post:input});
        setInput("");
      };

      return (
        <>
        <div className='input-area rounded'>
            <input type="text" value={input} className='message-input text-black w-full'onChange={(e)=> setInput(e.target.value)} /> 
            <button onClick={handlepost} className='bg-black h-11 w-100 rounded '>Send massage </button>
        </div>
        </>
      )
}