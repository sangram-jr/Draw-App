"use client"
import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import { useRouter } from "next/navigation";


interface canvasProps{
    roomId:string
}

export function RoomCanvas({roomId}:canvasProps){
    const [socket,setSocket]=useState<WebSocket | null>(null);
    const router=useRouter();

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            router.push("signin");
            return;
        }
        const ws=new WebSocket(`${WS_URL}?token=${token}`);

        ws.onerror=()=>{
            console.log("Websocket connection Error")
        }

        ws.onopen=()=>{
            setSocket(ws);
            ws.send(JSON.stringify({
                type:"join_room",
                roomId:roomId
            }))
        }

        //cleanup
        return()=>{
            ws.close();
        }

    },[roomId]);

    if(!socket){
        return <div>
            Connecting to Server.......
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}