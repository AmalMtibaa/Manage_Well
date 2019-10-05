import { Injectable } from '@angular/core';
import { Utilisateur } from "./utilisateur.model";
import {Subject, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {TaskDataService} from "../tache/task/task-data.service";
import {Task} from "../tache/task/task.model";
import {forEach} from "@angular/router/src/utils/collection";
declare var jquery: any;
declare var $: any;

@Injectable()
export class UserDataService {

  public constructor(private httpClient:HttpClient){}

//######################## With Data Base And Works !!#########################################

  public userHoraireEmitter=new Subject();
  getTabUser() {
    return this.httpClient.get<Utilisateur[]>('http://127.0.0.1:3000/user/all');
  }

  addNewUser(user: Utilisateur) {
    const body = JSON.stringify(user);
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    return  this.httpClient.post('http://127.0.0.1:3000/user/add', body,{headers: headers} );
  }

  deleteUser(idUser: number) {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    return this.httpClient.get(`http://127.0.0.1:3000/user/delete/${idUser}`);
  }

  getUserTaskById(idUser){
    return this.httpClient.get(`http://127.0.0.1:3000/user/userTasks/${idUser}`);
  }

  getAllUsersWorkedHours(startDate,endDate){

    let allUsersWorkedHours=[];
    let usersList;
    this.getTabUser().subscribe(
      data=>{
        usersList=<Utilisateur[]>data;
        let userTasksList;
        for(let i=0;i<usersList.length;i++) {
              this.getUserTaskById(usersList[i]._id).subscribe(
                tasks => {

                  userTasksList = <Task>tasks;
                  let workedHoursForSelectedUser = [];
                      for (let j = 0; j < userTasksList.length; j++) {

                          for (let k = 0; k < userTasksList[j].usersWorkedHours.length; k++) {

                            if (userTasksList[j].usersWorkedHours[k].idUser.toString() === usersList[i]._id) {

                              for (let a = 0; a < userTasksList[j].usersWorkedHours[k].workedHours.length; a++) {
                                workedHoursForSelectedUser.push(userTasksList[j].usersWorkedHours[k].workedHours[a]);
                              }
                            }
                          }
                    }

          let totalWorkedHours = 0;
          for (let z = 0; z < workedHoursForSelectedUser.length; z++) {

            //if(workedHoursForSelectedUser[z].date>=startDate && workedHoursForSelectedUser[z].date<=endDate){
            totalWorkedHours += workedHoursForSelectedUser[z].workedHoursByDay;
            //}
          }
          allUsersWorkedHours.push(totalWorkedHours);
        });
        }
        console.log("---allUsersWorkedHours------");
        console.log(allUsersWorkedHours);
        this.userHoraireEmitter.next(allUsersWorkedHours);
      });

  }

//#############################################################################

}
