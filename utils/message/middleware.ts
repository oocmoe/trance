import { Room } from "@/db/schema/room";

export async function tranceHi(content:string,type:string,room:Room) {
  if(!room.model || room.personnel.length === 0) return
  
}