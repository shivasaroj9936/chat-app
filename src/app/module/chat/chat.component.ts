import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, User } from 'src/app/constants/constant';
import { ChatService } from 'src/app/services/chatService/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './pages/dialog/dialog.component';
import { AddMembersComponent } from './pages/add-members/add-members.component';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  messageForm!: FormGroup;
  messageList: Message[] = [];
  usersList: User[] = [];
  groupList: any = [];
  selectedUser!: any;
  globalMessagesForPrivateChat: { [key: string]: [Message] } = {};
  globalMessagesForGroupChat: { [key: string]: [Message] } = {};
  show = false;
  chatType!: string;
  groupId!: string;
  loader=false;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  constructor(
    public chatService: ChatService,
    private formBuilder: FormBuilder,
    public user: UserService,
    private _router: Router,
    public dialog: MatDialog,
    private title: Title,
    private _snackBar: MatSnackBar,
    private observer: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.createForm();
    // to add new user
    this.openSnackBar('Login Successful', 'close')
    this.chatService.addNewUser(this.user.getUserData);
    this.chatService.getUsersList().subscribe((userList) => {
      this.usersList = userList;
      // console.log(userList);
      userList.forEach((user: any) => {
        if (user.userId == this.user.userDetails.userId)
          this.user.setUserData(user);
      });
    });

    //to get group list

    this.chatService.getGroupsList().subscribe((groupList) => {
      this.groupList = groupList;
    });
    this.title.setTitle(this.user.userDetails.name || 'user');
    this.chatService.getMessage().subscribe((message: Message) => {
      // To recieve messages

      if (message?.messageType == 'private') {
        const commonId = message.senderUserId + message.recieverUserId;
        let msg = this.globalMessagesForPrivateChat[commonId];
        msg
          ? this.globalMessagesForPrivateChat[commonId].push(message)
          : (this.globalMessagesForPrivateChat[commonId] = [message]);
        if (this.selectedUser && this.chatType == 'private') {
          this.messageList =
            this.globalMessagesForPrivateChat[
            this.user.userDetails?.userId + this.selectedUser?.userId
            ];
        }
        this.user.userDetails.commonId = commonId;
      } else {
        if (message) {
          let msg = this.globalMessagesForGroupChat[message?.groupId];
          msg
            ? this.globalMessagesForGroupChat[message?.groupId].push(message)
            : (this.globalMessagesForGroupChat[message?.groupId] = [message]);

          console.log(this.selectedUser, message);
          if (this.selectedUser['groupId'] == message['groupId']) {

            this.messageList =
              this.globalMessagesForGroupChat[message?.groupId];
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    this.loader=true;
    // if(this.loader){
      // setTimeout(() => {
        this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
          if (res.matches) {
            this.sidenav.mode = 'over';
            this.sidenav?.close();
          } else {
            this.sidenav.mode = 'side';
            this.sidenav?.open();
          }
        });
      // }, 1000);
 
  // }

  }


  createForm() {
    this.messageForm = this.formBuilder.group({
      message: [null, [Validators.required]],
    });
  }
  get message() {
    return this.messageForm.controls['message'];
  }

  //message send handelar
  sendMessage() {
    this.messageForm.controls['message'].patchValue(
      this.messageForm.controls['message'].value.trim()
    );
    if (this.messageForm.valid) {
      const message = this.message.value?.length > 2000 ? this.message.value?.slice(0, 2000) : this.message.value;
      let messagePayload: Message = {
        message: message,
        senderUserId: this.user.userDetails.userId,
        senderName: this.user.userDetails.name,
        time: new Date(),
        recieverUserId: this.selectedUser.userId,
        messageType: this.chatType,
        groupId: this.groupId,
      };
      this.chatService.sendMessage(messagePayload);
      this.message.reset();
    }
  }
  //user selection handelar
  onUserSelection(selectedUserData: User) {
    this.groupId = '';
    this.chatType = 'private';
    this.messageList =
      this.globalMessagesForPrivateChat[
      this.user.userDetails.userId + selectedUserData.userId
      ];

    this.selectedUser = selectedUserData;
    this.messageForm.reset();
  }
  //group selection handelar

  onGroupSelection(group: any) {

    this.chatType = 'group';
    this.groupId = group.groupId;
    this.selectedUser = group;
    this.messageList = this.globalMessagesForGroupChat[group.groupId];
    this.messageForm.reset();

  }
  //clearChat  handelar

  clearChat() {
    this.messageList = [];
    console.log(this.globalMessagesForPrivateChat[this.user.userDetails.commonId]);
    this.chatType == 'private' ? delete this.globalMessagesForPrivateChat[this.user.userDetails.commonId]
      : delete this.globalMessagesForGroupChat[this.selectedUser.groupId];
    console.log(this.globalMessagesForPrivateChat[this.user.userDetails.commonId]);

  }

  /**
   * @description closeWindow  handelar
   */
  
  closeWindow() {
    this.selectedUser = null;
    this.messageList = [];
  }
  logOut() {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: {},
      width: '400px',
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'ok') {
        this.messageList = [];
        this._router.navigate(['/login']);
      }
    });
  }
  /**
   * @description addGroupMembers  handelar
   */
  addGroupMembers() {
    const dialogRef = this.dialog.open(AddMembersComponent, {
      data: {
        usersList: this.usersList,
        admin: this.user.userDetails,
        groupsList: this.groupList,
        activeGroupID: this.selectedUser.groupId,
      },
      width: '400px',
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'cancel') {
        this.chatService.addNewGroupMembers(result);
        this.openSnackBar('Group Member List Updated', 'Close');
      }
    });
  }
  /**
   * @description to check member in any group
   * @param group 
   * @returns 
   */

  areYouPresentInGroup(group: any) {
    let ispresent = false;
    group.members?.forEach((member: User) => {
      if (member.userId == this.user.userDetails.userId) {
        ispresent = true;
      }
    });
    return ispresent;
  }
  // creation of new group
  addGroup(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: this.user.userDetails,
      width: '400px',
    });
    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'cancel') {
        let payload = {
          createrDetails: this.user.userDetails,
          name: result,
        };
        let groupAlreadyPresent = false;
        this.groupList.forEach((group: any) => {
          if (group.name?.toLowerCase() == result?.toLowerCase()) {
            groupAlreadyPresent = true;
          }
        });
        if (groupAlreadyPresent) {
          this.openSnackBar('This group is already present !', 'close')
        } else {

          this.chatService.createGroup(payload);
        }
      }
    });
  }
  // notification handelar
  openSnackBar(message: any, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: ['success-theme'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  ngOnDestroy(): void {
    this.user.resetUserData();

    this.chatService.disconnect();
  }
}
