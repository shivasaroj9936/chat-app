import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Message, User } from 'src/app/constants/constant';
// import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  message!: Message;
  public message$: BehaviorSubject<Message> = new BehaviorSubject(this.message);
  public usersList$: BehaviorSubject<[]> = new BehaviorSubject([]);
  public groupList$: BehaviorSubject<[]> = new BehaviorSubject([]);
  public notification$: Subject<any> = new Subject();
  socket!: Socket<DefaultEventsMap, DefaultEventsMap>;
  constructor() {}
  setupConnection() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling', 'flashsocket'],
    },
    
    
    );
    console.log(this.socket);
  }

  sendMessage(message: Message) {
    this.socket.emit('message', message);
  }

  getMessage = () => {
    this.socket.on('message', (message) => {
      console.log(message);
      this.message$.next(message);
    });
    return this.message$.asObservable();
  };

  getUsersList = () => {
    this.socket.on('users', (users) => {
      console.log(users, 'userList in service');
      this.usersList$.next(users);
    });
    return this.usersList$.asObservable();
  };
  getUpdatedUserList = () => {
    this.socket.on('updatedUsrList', (updatedUserList) => {
      console.log(updatedUserList, 'updatedUserList');
    });
  };
  isUserPresent(data: any) {
    this.socket.emit('isUserAvailable', data);
  }
  getNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('isUserAvailable', (data) => {
        console.log(data, 'isUserAvailable');

        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }

  addNewUser(user: any) {
    user.userId = Math.floor(Math.random() * 100000);
    console.log('new user add', user);

    this.socket.emit('newUser', user);
  }

  createGroup(groupDetails: {}) {
    this.socket.emit('create-group', groupDetails);
    console.log(groupDetails);
  }
  addNewGroupMembers(groupDetails: {}) {
    this.socket.emit('add-members', groupDetails);
  }
  getGroupsList = () => {
    this.socket.on('groupList', (groupList) => {
      console.log(groupList, 'groupList');
      this.groupList$.next(groupList);
    });
    return this.groupList$.asObservable();
  };

  disconnect() {
    this.socket.disconnect();
  }
}
