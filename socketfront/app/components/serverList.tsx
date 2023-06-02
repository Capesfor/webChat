import { Socket } from "socket.io-client";


export default function ServerList({socket}: {socket: Socket}) {
    //create fake data with a list of users
    const servers = ["server1", "server2", "server3"]
    return (
    <>
        <div className="bg-blue-800  w-full">
            {servers.map((user) => {
              return (  <li className="text-white">{user}</li>)
            }
            )}
        </div>
    </>
    )}