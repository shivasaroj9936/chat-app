
export type Message = {
      message:string,
      senderUserId:string,
      senderName:string,
      time:Date,
      recieverUserId:string,
      messageType:string,
      groupId:string

  };
  export type User = {
    name: string,
    email: string,
    password: string,
    userId:string,
    socketId:string,
    messages:Message [],
    // membersOfGroups:{}
  };
  export type GLOBAL_MESSAGE ={
    [key:string]:[Message]
  }