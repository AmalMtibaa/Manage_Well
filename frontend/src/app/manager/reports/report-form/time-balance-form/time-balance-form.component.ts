import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-time-balance-form',
  templateUrl: './time-balance-form.component.html',
  styleUrls: ['./time-balance-form.component.css']
})
export class TimeBalanceFormComponent implements OnInit {
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
