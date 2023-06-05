import { useState } from "react";
import { Socket } from "socket.io-client";


export default function ServerList({socket}: {socket: Socket}) {
    //create fake data with a list of users
    const [servers, setServers] = useState([]);

    const handleserver = (server: any) => {
        socket.emit("/join", server.target.dataset.value);
        
    }

    socket.on("serverList", (servers) => {
        console.log(servers);
        setServers(servers);
    });

    return (
    <>
        <div className="bg-blue-800  w-full">
            {servers.map((server,i) => {
              return (  <li key={i} >

                  <button onClick={handleserver} data-value={server}  key={i} className="text-white">{server}</button>
              </li>
                  )
            }
            )}
        </div>
    </>
    )}