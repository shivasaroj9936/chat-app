import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,

  ) { }

  ngOnInit(): void {
  }
  onNoClick() {
    this.dialogRef.close('cancel');
    console.log('canel');

  }
  onSubmit() {
    console.log('ok');

    this.dialogRef.close('ok');
  }

}
