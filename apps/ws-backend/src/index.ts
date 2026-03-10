import { WebSocketServer,WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prisma} from "@repo/db/db"

const wss = new WebSocketServer({ port: 8080 });

interface User{
  ws:WebSocket,
  rooms:string[],
  userId:string
}

//global array
const users:User[]=[];



//decode the token and get the useId from jwt
function cheakUser(token:string):string|null{
  try {
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload;
    if(typeof decoded=="string"){
      return null;
    }
    if(!decoded || !decoded.userId){
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
  
}



wss.on('connection', function connection(ws,request) {

  //send the token to the ws-server in a quary param for now to verify user based on token
  const url=request.url; //   ws://locahost:8080?token=123123
  if(!url){
    return;
  }
  const quaryParams=new URLSearchParams(url.split("?")[1]);
  const token=quaryParams.get("token");
  if(!token){
    return;
  }

  const userId=cheakUser(token);
  if(!userId){
    ws.close();
    return;
  }

  //push all the details into the users global array
  users.push({
    userId,
    rooms:[],
    ws
  })


  //get the message from user and send this message to server
  ws.on('message', async function message(data) {
    //msg that server get from the user, that is string, we need to convert this in a object
    const parseData=JSON.parse(data as unknown as string);

    if(parseData.type==="join_room"){            //parseData->  {"type":"join_room","roomId":"red"}
      //find the user from users global array
      const user=users.find(x=>x.ws===ws);
      if(!user){
        return;
      }
      //push the roomId to the rooms of the users global array
      user.rooms.push(parseData.roomId);
    }


    if(parseData.type==="leave_room"){          //parseData->  {"type":"leave_room","roomId":"red"}
      //find the user
      const user=users.find(x=>x.ws==ws);
      if(!user){
        return;
      }
      //delete the roomId from the rooms 
      user.rooms=user?.rooms.filter(x=>x!==parseData.roomId)
    }


    if(parseData.type==="chat"){           //parseData->  {"type":"chat","message":"hi there","roomId":"red"}
      const roomId=parseData.roomId;
      const message=parseData.message;


      //1st store the message to the db
      await prisma.chat.create({
        data:{
          roomId,
          message,
          userId
        }
      })

      //how many roomId include in the rooms , send them message.(2nd broadcast the message to everyone)
      users.forEach(user=>{
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            roomId
          }))
        }
      })
    }

  });

  
});