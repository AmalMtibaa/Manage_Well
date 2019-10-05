export  class Task{
  _id:string;
  name:string;
  status:boolean;
  duration:number;
  usersWorkedHours: {idUser:string,
        workedHours:{
          date:Date,
          workedHoursByDay:number
        }[]
      }[]
  projectId:string;
  creationDate:Date;
  deadline:Date;

  constructor(  id:string,
  name:string,
  status:boolean,
  duration:number,
  creationDate:Date,
  deadline:Date){

    this._id = id;
    this.name=name;
    this.status=status;
    this.duration=duration;
    this.creationDate=creationDate;
    this.deadline=deadline;
    this.usersWorkedHours=[];
    this.projectId="";

}
}
