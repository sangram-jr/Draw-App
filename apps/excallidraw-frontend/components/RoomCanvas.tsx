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
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OWYzZDNhZS05NWJlLTQxNDQtYmQ2YS1iOGVmZDRiNjFjMWEiLCJpYXQiOjE3NzM5ODY1NjR9.hqc-hp9VJvSPXMr30o59xkSkC1iXej7BO05l7CJ3ucY`);
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