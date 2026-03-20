"use client"

interface AuthpageProps{
    isSignin:boolean
}
export function Authpage({isSignin}:AuthpageProps){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="bg-white rounded p-6 m-2">
            <div className="p-2 text-black border">
                <input type="text" placeholder="email"/>
            </div>
            <div className="p-2 text-black border">
                <input type="password" placeholder="password"/>
            </div>
            <div className="pt-2">
                <button onClick={()=>{}}>{isSignin?"Sign In":"Sign Up"}</button>
            </div>
        </div>
    </div>
}