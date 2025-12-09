import {create} from "zustand";
import type {ChatMessage,MessageStatus} from "protocol";

interface State{
  messages:ChatMessage[];
  add:(m:ChatMessage)=>void;
  update:(id:string,s:MessageStatus)=>void;
  clear:()=>void;
}

export const useStore=create<State>(set=>({
  messages:[],
  add:m=>set(s=>({messages:[...s.messages,m].sort((a,b)=>a.timestamp-b.timestamp)})),
  update:(id,s)=>set(st=>({messages:st.messages.map(m=>m.id===id?{...m,status:s}:m)})),
  clear:()=>set({messages:[]})
}));
