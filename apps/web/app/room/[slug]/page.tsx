import axios from "axios";
import { BACKEND_URL } from "../../../config";
import { ChatRoom } from "../../../components/ChatRoom";
import { log } from "console";


export async function getRoomId(slug:string){
    const response=await axios.get(`${BACKEND_URL}/room/${slug}`);
    console.log(response.data);
    return response.data.room.id;
}


interface ChatRoomProp{
    params:{
        slug:string
    }
}

export default async function ChatRoom1({params}:ChatRoomProp){
    const slug=(await params).slug;
    const roomId=await getRoomId(slug);

    return <ChatRoom id={roomId} />
}