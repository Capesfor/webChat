import { Socket } from "socket.io-client";


export default function UserList({socket}: {socket: Socket}) {
    //create fake data with a list of users
    const users = ["user1", "user2", "user3"]
    return (
    <>
        <div className="bg-blue-800  w-full">
            {users.map((user) => {
              return (  <li className="text-white">{user}</li>)
            }
            )}
        </div>
    </>
    )}