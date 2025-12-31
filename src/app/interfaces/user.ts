export interface User{
  id:number,
  email:string,
  username:string,
  password:string,
  
  imageUrl:string,
  role:number,
  suggestion?:string,
  key?:string,
}

export enum SelectRole{
  ADMIN, 
  WRITER,
  USER,
}

export const RolesValues =[
  {value:0, title:'Admin'},
  {value:1, title:'Writer'},
  {value:2, title:'User'},
]