import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { json } from "stream/consumers";

type Shape={
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} | {
    type:"circle",
    centerX:number,
    centerY:number,
    radius:number
}

export async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){

    //create a global array where i store all the shape and display to the user.
    const existingShapes:Shape[]=await getExistingShapes(roomId);
    //get context or get shapes
    const ctx=canvas.getContext("2d");

    if(!ctx){
        return;
    }

    //when user draw a shape that need to push to the existingShape array.
    socket.onmessage=(event)=>{
        const message=JSON.parse(event.data);

        if(message.type==="chat"){
            const parsedMessage=JSON.parse(message.message);
            existingShapes.push(parsedMessage.shape);
            //clearCanvas act as a rerendering(after push , rerender everything)
            clearCanvas(existingShapes,canvas,ctx);

        }
    }

    clearCanvas(existingShapes,canvas,ctx);

    let clicked=false;
    let startX=0;
    let startY=0;

    //when user down the mouse
    canvas.addEventListener("mousedown",(e)=>{
        clicked=true;
        startX=e.clientX;
        startY=e.clientY;
    })

    //when user leaves the mouse
    canvas.addEventListener("mouseup",(e)=>{
        clicked=false;
        //find width & height of shape
        const width=e.clientX-startX;
        const height=e.clientY-startY;

        const shape:Shape={
            type:"rect",
            x:startX,
            y:startY,
            width:width,
            height:height
        }
        //when i leave the mouse,push the shape in the existingShapes array so that user can create multiple rectangle at the same time and previous rectangle do not disappear.
        existingShapes.push(shape);
        //when user leave mouse,send the shape 
        socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({
                shape
            }),
            roomId:roomId
        }))
                
    })

    //when user move the mouse
    canvas.addEventListener("mousemove",(e)=>{
        if(clicked){
            //find height and width of shape
            const width=e.clientX-startX;
            const height=e.clientY-startY;
            clearCanvas(existingShapes,canvas,ctx);
            //set rectangle white color
            ctx.strokeStyle="rgba(255,255,255)";
            //create rectangle from startX to width and startY to height
            ctx.strokeRect(startX,startY,width,height);
        }
                
    })
        
}


//re-render logic(when anything change, then i call this clearCanvas function to rerender everything)
function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
    //clear rectangle
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //set canvas or screen black color
    ctx.fillStyle="rgba(0,0,0,1)"
    ctx.fillRect(0,0,canvas.width,canvas.height);

    //display the existing shapes 
    existingShapes.map((shape)=>{
        if(shape.type==='rect'){
            //set rectangle white color
            ctx.strokeStyle="rgba(255,255,255)";
            //create rectangle from x to width and y to height
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
        }
    })
}

//get the data from backend
async function getExistingShapes(roomId:string){
    const response=await axios.get(`${HTTP_BACKEND}/chat/${roomId}`);
    const messages=response.data.messages;
    const shape=messages.map((x:{message:string})=>{
        const messageData=JSON.parse(x.message);
        return messageData.shape;
    })
    return shape;
}