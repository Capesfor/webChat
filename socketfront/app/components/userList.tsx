import { useState } from "react";
import { Socket } from "socket.io-client";


export default function UserList({socket}: {socket: Socket}) {
    //create fake data with a list of users
    const [users, setUsers] = useState([]);

    socket.on("usersList", (users) => {
        setUsers(users);
    });

    socket.on("user joined", (user) => {
        socket.emit("usersList");
    });


    return (
    <>
        <div className="bg-blue-800  w-full">
            {users.map((user,i) => {
              return (  <li key={i} className="text-white">{user}</li>)
            }
            )}
        </div>
    </>
    )}