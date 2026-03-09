import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

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

  //decode the token
  const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload;
  if(!decoded || !decoded.userId){
    ws.close();
    return;
  }

  //get the message and send "pong" message
  ws.on('message', function message(data) {
    ws.send('pong');
  });

  
});