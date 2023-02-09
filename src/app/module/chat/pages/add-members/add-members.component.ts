import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/constants/constant';

@Component({
  selector: 'app-add-members',
  templateUrl: './add-members.component.html',
  styleUrls: ['./add-members.component.scss'],
})
export class AddMembersComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddMembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar

  ) {}
  usersList: User[] = [];

  selectedOptions: any;
  ngOnInit(): void {
    // console.log(this.data);
    this.usersList = this.data.usersList;
  }

  onAreaListControlChanged(list: any) {
    console.log();
    
   

      this.selectedOptions = list.selectedOptions.selected.map(
        (item: any) => item.value
        );
      
  }
  onNoClick() {
    this.dialogRef.close('cancel');
  }
  onSubmit() {
    console.log(this.selectedOptions);
    
    if(this.selectedOptions.length>5){
      this.openSnackBar('Only 5 Group Members Are Allowed ', 'Close');
    }else{
      let returnData = {
        selectedOptions: this.selectedOptions,
        activeGroupId: this.data.activeGroupID,
      };
      this.dialogRef.close(returnData);
    }
  }
  areYouPresentInGroup(user: any) {
    let ispresent = false;
    this.data?.groupsList?.forEach((group: any) => {
      if (group.groupId == this.data.activeGroupID) {
        group?.members?.forEach((member: any) => {
          if (member.userId == user.userId) {
            ispresent = true;
          }
        });
      }
    });
    return ispresent;
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
}
