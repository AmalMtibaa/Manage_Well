export class Report{

  public type:string;
  public format:string;
  public name:string;
  public dateRange:string;
  public selectedStaff:string; // All staff or selectedStaff
  public selectedStaffList:string[]; //Empty if all Staff are selected


  public constructor(type:string,format:string,name:string,dateRange:string,selectedStaff:string,selectedStaffList:string[]){
    this.type=type;
    this.format=format;
    this.name=name;
    this.dateRange=dateRange;
    this.selectedStaff=selectedStaff;
    this.selectedStaffList=selectedStaffList;
  }
}
