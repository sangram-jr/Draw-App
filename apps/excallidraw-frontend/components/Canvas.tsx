import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Pencil,Circle,RectangleHorizontal,Eraser } from 'lucide-react';
import { Game } from "@/draw/Game";


/*declare global {
  interface Window {
    selectedTool: string; 
  }
}*/


export type Tool='circle' | 'pencil' | 'rect' |'eraser';

interface canvasProps{
    roomId:string,
    socket:WebSocket
}
export function Canvas({roomId,socket}:canvasProps){
    const canvasRef=useRef<HTMLCanvasElement>(null);
    const [selectedTool,setSelectedTool]=useState<Tool>('pencil');
    const [game,setGame]=useState<Game>();

    //when user click any tool('rect' | 'circle' | 'pencil'), save the state. In Game class , we have setTool function where we store the current tool's state.
    useEffect(()=>{
        game?.setTool(selectedTool);
    },[selectedTool,game])
    
    //when user draw, the create a instane of Game class(Game class-> all draw logic,mouse event listener is present)
    useEffect(()=>{
        if(canvasRef.current){
           // canvasRef.current.style.cursor =selectedTool === "eraser" ? "crosshair" : "default";
            const g=new Game(canvasRef.current,roomId,socket);
            //g.setTool(selectedTool);
            setGame(g);
            //g.setTool(selectedTool);

            //clean up
            return()=>{
                g.destroy();
            }
        }
        
    },[roomId,socket]);
        
    return <div style={{height:"100vh",overflow:"hidden"}}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>

        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
}


interface TopbarProps{
    selectedTool:Tool,
    setSelectedTool:(s:Tool)=>void
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
            <IconButton 
                onClick={()=>{setSelectedTool("eraser");
                }}
                icon={<Eraser/>}
                activated={selectedTool==="eraser"}
            />
        </div>
    </div>
}