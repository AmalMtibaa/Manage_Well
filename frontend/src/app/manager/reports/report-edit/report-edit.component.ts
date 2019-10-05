import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ReportsDataService} from "../reports-data.service";

//import for the calender
import {FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import {UserDataService} from "../../utilisateur/user-data.service";
import {Utilisateur} from "../../utilisateur/utilisateur.model";


const moment =  _moment;

@Component({
  selector: 'app-report-edit',
  templateUrl: 'report-edit.component.html',
  styleUrls: ['report-edit.component.css'],
  providers:[
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class ReportEditComponent implements OnInit {

  form:FormGroup;
  date= new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  idTypeReport:number;  //the id of the selected Type of Report
  dataRange=[];
  dataGrouping=[];
  dataGrouping2=[];
  reportTimeBalanceColumns=[];
  reportLeaveTimeBalance=[];
  leaveType=[];
  selectedStaff=[];
  reportType:string;
  userTab=[];
  calledByCalender:boolean=true;

  checkedList=[]; //for the check list of users.
  checkedListTypeLeave=[]; //for the check list of type leaves.


  constructor(private route:ActivatedRoute,
              private router:Router,
              private reportDataService:ReportsDataService,
              private userDataService:UserDataService){}

  selectedValue=null;

  ngOnInit() {

    this.route.params.subscribe(
      (params:Params)=>{
        this.idTypeReport=params['id'];
        this.dataRange=this.reportDataService.getDataRange();
        this.dataGrouping=this.reportDataService.getDataGrouping();
        this.dataGrouping2=this.reportDataService.getDataGrouping2();
        this.reportTimeBalanceColumns=this.reportDataService.getTimeBalanceColumns();
        this.reportLeaveTimeBalance=this.reportDataService.getTimeLeaveColumns();
        this.reportType=this.reportDataService.getReportType(this.idTypeReport);
        this.leaveType=this.reportDataService.getLeaveTypes();
        this.selectedStaff=this.reportDataService.getSelectedStaff();
        this.userDataService.getTabUser().subscribe(
          data=>{
            this.userTab=<Utilisateur[]>data
          }
        );


        this.form=new FormGroup(
          {
            'name':new FormControl(null),
            'dataRange': new FormControl(this.dataRange[0]),
            'date1':new FormControl(this.firstDay),
            'date2':new FormControl(this.lastDay),
            'dataGrouping1':new FormControl(this.dataGrouping[0]),
            'dataGrouping2':new FormControl(this.dataGrouping2[0]),
            'reportTimeBalanceColumns':new FormControl(this.reportTimeBalanceColumns[0]),
            'reportLeaveTimeBalance':new FormControl(this.reportLeaveTimeBalance[0]),
            'leaveType':new FormControl('All leaves Time'),
            'selectedStaff':new FormControl(this.selectedStaff[0])
          }
        );
      }
    )

  }


  onSelectDateRange(sel){
      this.calledByCalender=false;
      const index=sel.value[0];
      if(index==0){ //current Date
          this.form.patchValue(
            {date1:moment(this.firstDay),
             date2:moment(this.lastDay)}
          )

      }

      if(index==1){ //previous month

        const firstDay = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
        const lastDay = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.form.patchValue(
          {
            date1:moment(moment(firstDay)),
            date2:moment(moment(lastDay))}
        );
      }
      if(index==2){ //next month ff
        const firstDay = new Date(this.date.getFullYear(), this.date.getMonth()+1, 1);
        const lastDay = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
        this.form.patchValue(
          { date1:moment(moment(firstDay)),
            date2:moment(moment(lastDay))}
        );
      }
      if(index==3){ //curent week 3
        const curr = new Date; // get current date
        const first = curr.getDate() - curr.getDay()+1; // First day is the day of the month - the day of the week
        const last = first + 5; // last day is the first day + 6
        const firstDay = new Date(curr.setDate(first));
        const lastDay = new Date(curr.setDate(last));

        this.form.patchValue(
          { date1:moment(moment(firstDay)),
            date2:moment(moment(lastDay))}
        );
      }
      if(index==4){ //previous  week
        const curr = new Date; // get current date
        const first = curr.getDate() - curr.getDay()+1; // First day is the day of the month - the day of the week
        const last = first - 7;
        const firstDay = new Date(curr.setDate(last));
        const lastDay = new Date(curr.setDate(first));

        this.form.patchValue(
          {date1:moment(moment(firstDay)),
            date2:moment(moment(lastDay))}
        );
      }

     //Le reste sera traité une autre fois.
    if(index==8){
      this.calledByCalender=true;
    }

  }
  onChangeCalender(){

      console.log('changed');
      if(this.calledByCalender){
        this.form.patchValue(
          {
            dataRange: 'Custom Date Range'
          }
        );
      }
   }
    onSelectedDataGr1(sel){
    this.reportDataService.reportEmitter.next(sel.value[0]);
  }

  onSelectedDataGr2(sel2,sel1){
      const x= +sel1.value[0];
      const result1:number=x+1;
      const result2:number=+sel2.value[0];
    if(result1==result2){
        this.form.controls['dataGrouping2'].setErrors({'incorrect': true});
    }
    this.reportDataService.reportEmitter2.next(sel2.value[0]);
  }

  onSubmit(){
    let formToSubmit=this.form.value;
    if(this.form.get('selectedStaff')){
      this.form.value.usersStaff=this.checkedList;
    }
    else
    {
      //this.form.value.usersStaff=this.userTab;
      //Search for All Users Ids
    }
    console.log(formToSubmit);
    this.router.navigate(['../../generated-report'],{relativeTo:this.route});
  }

  onCheckboxLeaveType(option,event){
    if (event.target.checked) {
      this.checkedListTypeLeave.push(option);
    } else {
      for (var i = 0; i < this.leaveType.length; i++) {
        if (this.checkedListTypeLeave[i] == option) {
          this.checkedListTypeLeave.splice(i, 1);
        }
      }
    }
    console.log(this.checkedListTypeLeave);
  }
  onCheckboxChange(option, event) {

    if (event.target.checked) {
      this.checkedList.push(option._id);
    } else {
      for (var i = 0; i < this.userTab.length; i++) {
        if (this.checkedList[i] == option._id) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    console.log(this.checkedList);
  }


}
