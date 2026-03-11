"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hook/useSocket";


interface Message {
  message: string;
}

interface ChatRoomClientProps {
  messages: Message[];
  id: string;
}
export function ChatRoomClient({messages,id}:ChatRoomClientProps){
    const{socket,loading}=useSocket();
    const[chats,setChats]=useState(messages);
    const[currentMessage,setCurrentMessage]=useState("");
    

    useEffect(()=>{
        if(socket && !loading){
            //send the message to connect the room
            socket.send(JSON.stringify({
                type:"join_room",
                roomId:id
            }))


            socket.onmessage=(event)=>{
                const parseData=JSON.parse(event.data);
                if(parseData.type==='chat'){
                    setChats(c=>[...c,{message:parseData.message}]);
                }
            }
        }
        

    },[socket,loading,id])


    //render all the msg
    return <div>
        {
            chats.map((m,i)=>(
                <div key={i}>
                    {m.message}
                </div>
            ))
        }
        <input value={currentMessage} onChange={(e)=>{setCurrentMessage(e.target.value)}} type="text"/>
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type:"chat",
                roomId:id,
                message:currentMessage
            }))
            setCurrentMessage("");
        }}>Send Message</button>
    </div>
}