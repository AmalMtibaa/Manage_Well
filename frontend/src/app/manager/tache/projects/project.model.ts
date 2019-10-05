
import {Task} from "../task/task.model";
import {Client} from "../../client/client.model";

export class Project{
  _id:string;
  name:string ;
  duration : number; //Estimated Total Hours needed
  client: string; //should be later a Client model
  status:string;
  tasks:Task[];
  startDay:Date;
  deadline:Date;
  totalWorkedHours:number;
  staffHours:{staffId:number,workedHours:number}[];


  constructor(id:string,name:string,duration:number,client:string,status:string,tasks:Task[],
              startDay:Date ,deadline:Date,totalWorkedHours:number, staffHours:{staffId:number,workedHours:number}[]){
    this._id=id;
    this.name=name;
    this.duration=duration;
    this.client=client;
    this.status=status;
    this.startDay=startDay;
    this.deadline=deadline;
    this.totalWorkedHours=totalWorkedHours;
    this.staffHours=staffHours;
    this.tasks=tasks;
  }

  getName(){
    return this.name;
  }

  getTotalWorkedHours(){
    return this.totalWorkedHours;
  }
}
