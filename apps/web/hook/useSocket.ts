"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../config";


export function useSocket() {

    const[loading,setLoading]=useState(true);
    const[socket,setSocket]=useState<WebSocket>();
    
    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZjhlYjc3MC0yMzAxLTRkYWItYjVjYy00YWVmMmUyZjMyNTUiLCJpYXQiOjE3NzMxMjI5ODJ9.RivNCb6QixwcleSLgKho9hgx6ciLpRRyon39CS8Sb4A`);
        ws.onopen=()=>{
            setLoading(false);
            setSocket(ws);
        }
    },[]);
    return {
        socket,
        loading
    }
}