import axios from "axios"
import { BACKEND_URL } from "../config"
import { ChatRoomClient } from "./ChatRoomClient";


async function getChat(roomId:string) {
    const response=await axios.get(`${BACKEND_URL}/chat/${roomId}`);
    return response.data.messages;
}



interface ChatRoomProp{
    id:string
}
export async function ChatRoom({id}:ChatRoomProp){
    const messages=await getChat(id);
    return <ChatRoomClient id={id} messages={messages}/>
}


