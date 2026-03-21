import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

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
} | {
    type:"pencil",
    startX:number,
    startY:number,
    endX:number,
    endY:number
}


export class Game{

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    private existingShapes:Shape[];
    private roomId:string;
    private clicked:boolean;
    private socket:WebSocket;
    private startX=0;
    private startY=0;
    private selectedTool:Tool='circle';

    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d")!;
        this.existingShapes=[];
        this.roomId=roomId;
        this.clicked=false;
        this.socket=socket;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();

    }

    setTool(tool:'circle' | 'rect' | 'pencil'){
        this.selectedTool=tool;
    }

    async init(){
        this.existingShapes=await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers(){
        //when user draw a shape that need to push to the existingShape array.
        this.socket.onmessage=(event)=>{
            const message=JSON.parse(event.data);

            if(message.type==="chat"){
                const parsedMessage=JSON.parse(message.message);
                this.existingShapes.push(parsedMessage.shape);
                //clearCanvas act as a rerendering(after push , rerender everything)
                this.clearCanvas();

            }
        }

    }

    //re-render logic(when anything change, then i call this clearCanvas function to rerender everything)
    clearCanvas(){
        //clear rectangle
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //set canvas or screen black color
        this.ctx.fillStyle="rgba(0,0,0,1)"
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        //display the existing shapes 
        this.existingShapes.map((shape)=>{
            if(shape.type==='rect'){
                //set rectangle white color
                this.ctx.strokeStyle="rgba(255,255,255)";
                //create rectangle from x to width and y to height
                this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height);
            }else if(shape.type==='circle'){
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX,shape.centerY,Math.abs(shape.radius),0,Math.PI*2);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        })
    }

    //mouse handlers
    initMouseHandlers(){

        //when user down the mouse
        this.canvas.addEventListener("mousedown",(e)=>{
            this.clicked=true;
            this.startX=e.clientX;
            this.startY=e.clientY;
        })


        //when user leaves the mouse
        this.canvas.addEventListener("mouseup",(e)=>{
            this.clicked=false;
            //find width & height of shape
            const width=e.clientX-this.startX;
            const height=e.clientY-this.startY;

            //based on selectedTool's state , we push shape into existingShapes global array.
            const selectedTool=this.selectedTool;
            let shape:Shape | null=null;
            if(selectedTool==='rect'){
                shape={
                    type:"rect",
                    x:this.startX,
                    y:this.startY,
                    width:width,
                    height:height
                }
            }else if(selectedTool==='circle'){
                const radius=Math.max(width,height)/2;
                shape={
                    type:"circle",
                    radius:radius,
                    centerX:this.startX+radius,
                    centerY:this.startY+radius
                }

            }
            if(!shape){
                return;
            }
            //when i leave the mouse,push the shape in the existingShapes array so that user can create multiple rectangle at the same time and previous rectangle do not disappear.
            this.existingShapes.push(shape);

            
            
            //when user leave mouse,send the shape 
            this.socket.send(JSON.stringify({
                type:"chat",
                message:JSON.stringify({
                    shape
                }),
                roomId:this.roomId
            }))
                    
        })

        //when user move the mouse
        this.canvas.addEventListener("mousemove",(e)=>{
            if(this.clicked){
                //find height and width of shape
                const width=e.clientX-this.startX;
                const height=e.clientY-this.startY;
                this.clearCanvas();
                //set rectangle white color
                this.ctx.strokeStyle="rgba(255,255,255)";

                //based on selectedTool's state , we draw shape
                const selectedTool=this.selectedTool;
                if(selectedTool==='rect'){
                    //create rectangle from startX to width and startY to height
                    this.ctx.strokeRect(this.startX,this.startY,width,height);
                }else if(selectedTool==='circle'){
                    const radius=Math.max(width,height)/2;
                    const centerX=this.startX+radius;
                    const centerY=this.startY+radius;
                    this.ctx.beginPath();
                    this.ctx.arc(centerX,centerY,Math.abs(radius),0,Math.PI*2);
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
                
            }
                    
        })
    }
}