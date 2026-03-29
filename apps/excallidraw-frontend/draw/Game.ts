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
    points:{x:number,y:number}[]
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
    private currentPoints:{x:number,y:number}[]=[];

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
        //for smooth lines(pencil logic)
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.lineWidth = 2;
    }

    //destroy all mouseHandlers  event
    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup",this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);
        //websocket cleanup
        this.socket.onmessage = null;
    }


    //Called from Canvas.tsx
    //When user clicks button → tool changes
    setTool(tool:'circle' | 'rect' | 'pencil'){
        this.selectedTool=tool;
    }


    //load old shapes
    async init(){
        this.existingShapes=await getExistingShapes(this.roomId);
        this.clearCanvas();
    }


    //listen WebSocket
    initHandlers(){
        //Incoming msg from server
        this.socket.onmessage=(event)=>{
            //parse message from server(data store string format , we need to convert it to object)
            const message=JSON.parse(event.data);

            if(message.type==="chat"){
                //When another user draws: server sends shape,you receive it,add to your shapes,redraw everything(by clearCanvas function)
                const parsedMessage=JSON.parse(message.message);
                this.existingShapes.push(parsedMessage.shape);
                //clearCanvas act as a rerendering(after push , rerender everything)
                this.clearCanvas();

            }
        }

    }


    //draw rectangle logic
    drawRect(x: number, y: number, width: number, height: number) {
        //set rectangle white color
        this.ctx.strokeStyle = "rgba(255,255,255)";
        //create rectangle from x to width and y to height
        this.ctx.strokeRect(x, y, width, height);
    }


    //draw circle logic
    drawCircle(centerX: number, centerY: number, radius: number) {
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }


    //draw pencil logic
    drawPencil(points:{x:number,y:number}[]){
        this.ctx.beginPath();
        for(let i=0;i<points.length;i++){
            const p=points[i];
            if(i===0){
                this.ctx.moveTo(p.x,p.y);
            }else{
                this.ctx.lineTo(p.x,p.y);
            }
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }



    //re-render logic(when anything change, then i call this clearCanvas function to rerender everything)
    clearCanvas(){
        //clear rectangle
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //set canvas or screen black background
        this.ctx.fillStyle="rgba(0,0,0,1)"
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        //display the existing shapes 
        this.existingShapes.forEach((shape)=>{
            if(shape.type==='rect'){
                this.drawRect(shape.x,shape.y,shape.width,shape.height,);
            }else if(shape.type==='circle'){
                this.drawCircle(shape.centerX,shape.centerY,shape.radius);
            }else if(shape.type==='pencil'){
                this.drawPencil(shape.points);
            }
        })
    }


    mouseDownHandler=(e:MouseEvent)=>{
        this.clicked=true;
        //fix the canvas cordinates
        const rect=this.canvas.getBoundingClientRect();
        const x=e.clientX-rect.left;
        const y=e.clientY-rect.top;
        this.startX=x;
        this.startY=y;

        //when mouse down, Start new pencil drawing
        if(this.selectedTool==='pencil'){
            this.currentPoints=[{x,y}];
        }
    }

    mouseUpHandler=(e:MouseEvent)=>{
        this.clicked=false;

        //fix the canvas cordinates
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        //find width & height of shape
        const width=x-this.startX;
        const height=y-this.startY;

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

        }else if(selectedTool==='pencil'){
            //save full pencil drawing
            shape={
                type:"pencil",
                points:this.currentPoints
            }
        }
        if(!shape){
            return;
        }
        //when i leave the mouse,push the shape in the existingShapes array so that user can create multiple rectangle at the same time and previous rectangle do not disappear.
        this.existingShapes.push(shape);
        //all shapes redrawn
        this.clearCanvas();  
            
        //when user leave mouse,send the shape to server
        this.socket.send(JSON.stringify({
            type:"chat",
            message:JSON.stringify({ shape }),
            roomId:this.roomId
        }))
    }

    mouseMoveHandler=(e:MouseEvent)=>{
        if(this.clicked){
            //fix the canvas cordinates
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            //find height and width of shape
            const width=x-this.startX;
            const height=y-this.startY;
            
            this.clearCanvas();
            //set rectangle white color
            this.ctx.strokeStyle="rgba(255,255,255)";

            //based on selectedTool's state , we draw shape
            const selectedTool=this.selectedTool;

            if(selectedTool==='rect'){
                this.drawRect(this.startX, this.startY, width, height);
            }else if(selectedTool==='circle'){
                const radius=Math.max(width,height)/2;
                const centerX=this.startX+radius;
                const centerY=this.startY+radius;
                this.drawCircle(centerX, centerY, radius);
            }else if(selectedTool==='pencil'){
                //when mouse move, push all the new points(x,y) into the currentPoints array and call drawPencil function
                this.currentPoints.push({x,y});
                this.clearCanvas();
                this.drawPencil(this.currentPoints);
            }
                
        }
    }

    // Add mouse handlers event
    initMouseHandlers(){
        //when user down the mouse
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);

        //when user leaves the mouse
        this.canvas.addEventListener("mouseup",this.mouseUpHandler);

        //when user move the mouse
        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
    }
}