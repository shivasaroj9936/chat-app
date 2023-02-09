import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PATTERN } from 'src/app/constants/regex';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  groupName = FormControl;
  gorupForm!: FormGroup;
  cancel: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.gorupForm = this.formBuilder.group({
      groupName: [null, [Validators.required, Validators.maxLength(15), Validators.pattern(PATTERN.name)]],
    });
  }
  onNoClick(cancel: Boolean) {
    this.cancel = cancel;
    this.dialogRef.close('cancel');
    console.log('canel');

  }
  onSubmit() {
    this.gorupForm.controls['groupName'].patchValue(
      this.gorupForm.controls['groupName'].value?.trim()
    );
    if (this.gorupForm.valid && !this.cancel)
      this.dialogRef.close(this.gorupForm.controls['groupName'].value);
  }
}
