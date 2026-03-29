import { HTTP_BACKEND } from "@/config";
import axios from "axios";

//get the data from http backend
export async function getExistingShapes(roomId:string){
    const response=await axios.get(`${HTTP_BACKEND}/chat/${roomId}`);
    const messages=response.data.messages || [];
    const shape=messages.map((x:{message:string})=>{
        const messageData=JSON.parse(x.message);
        return messageData.shape;
    })
    return shape;
}