"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";



export default function Home() {
  const [roomId,setRoomId]=useState("");
  const router=useRouter();


  return (
    <div>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw"}}>
        <input value={roomId} onChange={(e)=>{setRoomId(e.target.value)}} type="text" placeholder="Enter Room Id" style={{padding:10}}/>
        <button onClick={()=>{router.push(`/room/${roomId}`)}} style={{padding:10,cursor:"pointer"}}>Join Room</button>
      </div>
    </div>
  );
}
