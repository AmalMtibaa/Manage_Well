import {Report} from "./report.model";
import {Subject} from "rxjs";
export class ReportsDataService{

  reportEmitter=new Subject();
  reportEmitter2=new Subject();

  reportChanged=new Subject<Report[]>();

  private reports=[
      new Report('Time Balance & Overtime','html','Avancement ManageWell','Current week','All Staff',[]),
      new Report('Leave Time & Balances','pdf','Total Abscence ManageWell','Current month','All Staff',[]),
      new Report('Leave Time & Balances','excel','Total','Previous year','Selected Staff',['Akram'])
  ];

  private reportsTypes =[
    'Time Balance & Overtime',
    'Leave Time & Balances'
  ];
  private dataRange=[
    'Current month',
    'Previous month',
    'Next month',
    'Current week',
    'Previous week',
    'Next week',
    'Current year',
    'Previous year',
    'Custom Date Range',
    ];

  private dataGrouping=[
    'Users',
    'Days',
    'Weeks',
    'Months'
    ];

  private dataGrouping2=[
    'Do not use 2nd grouping level',
    'Users',
    'Days',
    'Weeks',
    'Months'
  ];

  private reportTimeBalanceColumns=[
    'Time Balance & overtime',
    'Time Balance only',
  ];

  private reportLeaveTimeColumns=[
    'Leave Time & Balances',
    'Leave Time only',
  ]



  private leaveType=[
      'Vacation',
      'Family leave',
      'Time off',
      'Sick leave',
      'Medical Treatment',
      'Studies',
      'Business Trip',
  ]
  private selectedStaff=[
    'All Staff',
    'Selected Staff'
  ]
  getReportsTypes(){
    return this.reportsTypes.slice();
  }

  getDataRange(){
    return this.dataRange.slice();
  }

  getDataGrouping(){
    return this.dataGrouping.slice();
  }

  getDataGrouping2(){
    return this.dataGrouping2.slice();
  }

  getTimeBalanceColumns(){
    return this.reportTimeBalanceColumns.slice();
  }
  getTimeLeaveColumns(){
    return this.reportLeaveTimeColumns.slice();
  }

  getReportType(index:number){
    return this.reportsTypes[index];
  }
  getLeaveTypes(){
    return this.leaveType;
  }

  getCustomDateRange(){
    return this.dataRange[8].slice();
  }

  getSelectedStaff(){
    return this.selectedStaff.slice();
  }

  getReports(){
    return this.reports.slice();
  }

  getDataGroupingMember(id:number){
    return this.dataGrouping[id];
  }

  getDataGroupingMember2(id:number){
    return this.dataGrouping2[id].slice();
  }

  deleteReport(index:number){
    console.log("index----------------"+index);
    this.reports.splice(index,1)
    console.log(this.reports);
    this.reportChanged.next(this.reports);

  }

}
