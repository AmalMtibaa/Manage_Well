import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {Subject} from "rxjs";

@Injectable()
export class TaskDataService{

  public taskEmitter=new Subject();
  public taskUpdateEmitter=new Subject();


  constructor(private httpClient:HttpClient){}


  addTask(task){
    let body=JSON.stringify(task)  ;
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    return  this.httpClient.post('http://127.0.0.1:3000/task/add', body,{headers: headers});
  }

  getTasksByProject(idProject:string){
    return this.httpClient.get(`http://127.0.0.1:3000/task/projectTasksList/${idProject}`);
  }

  getTasksByClient(idClient:string){
    return this.httpClient.get(`http://127.0.0.1:3000/task/clientTasksList/${idClient}`);
  }

  deleteTask(task){

    let body=JSON.stringify(task)  ;

    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    return this.httpClient.post(`http://127.0.0.1:3000/task/delete`, body,{headers: headers});
  }

  updateTask(task){
    let body=JSON.stringify(task)  ;
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
    return this.httpClient.post(`http://127.0.0.1:3000/task/update`, body,{headers: headers})
  }

  getTasks(){
    return this.httpClient.get(`http://127.0.0.1:3000/task/all`);
  }

  saveWorkedHoursOfUser(idUser, workedHours) {
    let body = JSON.stringify({
      idUser: idUser,
      workedHours: workedHours
    });
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
    return this.httpClient.post(`http://127.0.0.1:3000/task/saveWorkTask`, body, { headers: headers })
  }

}
