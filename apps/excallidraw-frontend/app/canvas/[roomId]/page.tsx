import { RoomCanvas } from "@/components/RoomCanvas";



interface CanvasPageProps {
  params: {
    roomId: string;
  };
}

export default async function Canvaspage({params}:CanvasPageProps){
    const roomId=(await params).roomId
    // console.log(roomId);

    return <RoomCanvas roomId={roomId} />
}