import { Project } from "./project.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Task } from "../task/task.model";

import {HttpClient,HttpHeaders} from "@angular/common/http";
import {ClientDataService} from "../../client/client-data.service";
import {TaskDataService} from "../task/task-data.service";

@Injectable()
export class ProjectDataService {

  public updateProjectEmitter=new Subject();
  public addProjectEmitter=new Subject();
  public projectHoraireEmitter=new Subject();
  public projectForSelectedUserEmitter=new Subject();

  public constructor(private httpClient:HttpClient,private taskDataService:TaskDataService){}

  //################################### With Data BASE ###########################
  getProjects() {
    return this.httpClient.get('http://127.0.0.1:3000/project/all');
  }

  idProject:string;
  clientName:string;

  addProject(body) {

    const headers = new HttpHeaders()
        .set('Authorization', 'my-auth-token')
        .set('Content-Type', 'application/json');

    return  this.httpClient.post('http://127.0.0.1:3000/project/ajout', body,{headers: headers} );
  }

  getProject(idProject:string){
    console.log('We are in the method get project'+ idProject);
    return this.httpClient.get(`http://127.0.0.1:3000/project/one/${idProject}`);
  }

  getProjectsNameByID(projectsClient:string[]){

    let body=JSON.stringify(projectsClient);
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    return this.httpClient.post('http://127.0.0.1:3000/project/some',body,{headers: headers});
  }

  deleteProject(idProject: string,clientName:string) {
   return this.httpClient.get(`http://127.0.0.1:3000/project/delete/${idProject}/${clientName}`);

  }

  updateProject(project){
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    return  this.httpClient.post('http://127.0.0.1:3000/project/update', project,{headers: headers} );

  }

  getTotalProjectsWorkedHours(){ //should have startDay and end Date
    let totalProjectsWorkedHours=[];
    let projectsList;
    this.getProjects().subscribe(
      projects=>{
        projectsList=<Project[]>projects;

        for(let i=0;i<projectsList.length;i++){
          let totalWorkedHours = 0;
          let projectTask;
          this.taskDataService.getTasksByProject(projectsList[i]._id).subscribe(
            tasks=>{
              projectTask=<Task[]>tasks;
            for(var j=0;j<projectTask.length;j++){
              for (let k = 0; k < projectTask[j].usersWorkedHours.length; k++) {

                  for (let a = 0; a < projectTask[j].usersWorkedHours[k].workedHours.length; a++) {
                    totalWorkedHours+=projectTask[j].usersWorkedHours[k].workedHours[a].workedHoursByDay;
                  }
                }
              }
              totalProjectsWorkedHours.push(totalWorkedHours);
          });
        }
        this.projectHoraireEmitter.next(totalProjectsWorkedHours);
      /*  console.log("---totalProjectsWorkedHours------");
        console.log(totalProjectsWorkedHours);*/
      });
  }

  getProjectTasksListByUser(idProject,idUsers){
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');
    let parm={idProject:idProject,idUsers:idUsers};
    let body=JSON.stringify(parm);

    return  this.httpClient.post('http://127.0.0.1:3000/task/projectTasksListByUser', body,{headers: headers} );

  }


  calculateTotalWorkedHoursByStaff(staffId: string[]) {

    let totalWorkedHours = [];
    let projectsList;
    this.getProjects().subscribe(
      projects=>{
        projectsList=<Project[]>projects;
        for (let i=0;i<projectsList.length;i++) {
          let totalHours = 0;
          let WorkedHoursByProjectByUser;
          this.getProjectTasksListByUser(projectsList[i]._id, staffId).subscribe(
            data => {

              WorkedHoursByProjectByUser =data;
              for(let j=0;j<WorkedHoursByProjectByUser.length;j++){
                for(let a=0;a<WorkedHoursByProjectByUser[j].length;a++){
                  totalHours+=WorkedHoursByProjectByUser[j][a].workedHoursByDay;
                }
              }
              totalWorkedHours.push(totalHours);
            });

        }
        this.projectForSelectedUserEmitter.next(totalWorkedHours);
      });
  }


  //###############################################################################

}
