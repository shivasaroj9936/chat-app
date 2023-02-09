import { Component, Input, OnInit } from '@angular/core';
import { Message, User } from 'src/app/constants/constant';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
@Input() message!:Message;
@Input() user:any;
@Input() chatType:any;
show=false;
  constructor() { }

  ngOnInit(): void {
  }

}
