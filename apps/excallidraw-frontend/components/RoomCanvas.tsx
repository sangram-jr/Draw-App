"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";


interface canvasProps{
    roomId:string
}

export function RoomCanvas({roomId}:canvasProps){
    const [socket,setSocket]=useState<WebSocket | null>(null);

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            alert("User not authenticated");
            return;
        }
        const ws=new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))
        }
    },[]);

    if(!socket){
        return <div>
            Connecting to Server.......
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}