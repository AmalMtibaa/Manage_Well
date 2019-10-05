import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-leave-time-balance',
  templateUrl: './leave-time-balance.component.html',
  styleUrls: ['./leave-time-balance.component.css']
})
export class LeaveTimeBalanceComponent implements OnInit {

  @Input()db1;
  @Input()db2;
  constructor() { }

  ngOnInit() {
    this.db1="Users";
    this.db2="Do not use 2nd grouping level"
  }
  //to repeat a div n time
  Arr = Array; //Array type captured in a variable
  num:number = 3;
}
