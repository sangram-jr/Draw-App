import { ReactNode } from "react";

interface IconButtonProps{
    icon:ReactNode,
    activated:boolean,
    onClick:()=>void
}
export function IconButton({icon,activated,onClick}:IconButtonProps){
    return <div onClick={onClick} className={`m-2 p-2 cursor-pointer rounded-full bg-black border hover:bg-gray ${activated ? "text-red-600" : "text-white"}`}>
        {icon}
    </div>
}