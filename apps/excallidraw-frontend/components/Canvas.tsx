import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Pencil,Circle,RectangleHorizontal } from 'lucide-react';


type Shape='circle' | 'pencil' | 'rect';

interface canvasProps{
    roomId:string,
    socket:WebSocket
}
export function Canvas({roomId,socket}:canvasProps){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    const [selectedTool,setSelectedTool]=useState<Shape>('pencil');
        
    useEffect(()=>{
        if(canvasRef.current){
            const canvas=canvasRef.current;
            initDraw(canvas,roomId,socket);
        }
        
    },[canvasRef])
        
    return <div style={{height:"100vh",overflow:"hidden"}}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>

        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}


interface TopbarProps{
    selectedTool:Shape,
    setSelectedTool:(s:Shape)=>void
}

function Topbar({selectedTool,setSelectedTool}:TopbarProps){
    return <div className="fixed top-10 left-10">
        <div className="flex gap-2">
            <IconButton 
                onClick={()=>{setSelectedTool("pencil")}}
                icon={<Pencil/>}
                activated={selectedTool==="pencil"}
            />
            <IconButton 
                onClick={()=>{setSelectedTool("circle")}}
                icon={<Circle/>}
                activated={selectedTool==="circle"}
            />
            <IconButton 
                onClick={()=>{setSelectedTool("rect")}}
                icon={<RectangleHorizontal/>}
                activated={selectedTool==="rect"}
            />
        </div>
    </div>
}