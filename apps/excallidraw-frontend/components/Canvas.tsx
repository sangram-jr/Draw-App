import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

interface canvasProps{
    roomId:string,
    socket:WebSocket
}
export function Canvas({roomId,socket}:canvasProps){
    const canvasRef=useRef<HTMLCanvasElement>(null);
        
    useEffect(()=>{
        if(canvasRef.current){
            const canvas=canvasRef.current;
            initDraw(canvas,roomId,socket);
        }
        
    },[canvasRef])
        
    return <div>
        <canvas ref={canvasRef} width={2000} height={1000}></canvas>
    </div>
}