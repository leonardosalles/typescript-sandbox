export type MessageStatus="sent"|"received"|"displayed";

export interface ChatMessage{
  id:string;
  from:string;
  to:string;
  body:string;
  timestamp:number;
  status:MessageStatus;
}
