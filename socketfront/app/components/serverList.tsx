import { useState } from "react";
import { Socket } from "socket.io-client";


export default function ServerList({socket}: {socket: Socket}) {
    //create fake data with a list of users
    const [servers, setServers] = useState([]);

    socket.on("serverList", (servers) => {
        console.log(servers);
        setServers(servers);
    });

    return (
    <>
        <div className="bg-blue-800  w-full">
            {servers.map((user,i) => {
              return (  <li  key={i} className="text-white">{user}</li>)
            }
            )}
        </div>
    </>
    )}