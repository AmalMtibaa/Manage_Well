import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { UserDataService } from "../../utilisateur/user-data.service";
import { TaskDataService } from "../../tache/task/task-data.service";
declare var jquery: any;
declare var $: any;
declare var initThemeChooser: any;

@Component({
  selector: 'app-cr',
  templateUrl: './cr.component.html',
  styleUrls: ['./cr.component.css']
})
export class CrComponent implements OnInit, AfterViewInit {


  id: string = "5b59c25f1539820360e55bf3";
  tasks;
  workedHours: any[] = [];

  constructor(private userDataService: UserDataService, private taskDataService: TaskDataService) { }

  ngOnInit() {
    this.userDataService.getUserTaskById(this.id).subscribe(
      data => {
        console.log(data);
        this.tasks = data;
      }
    )
  }
  todayDate;
  onSaveWork(event) {
    // this.todayDate = new Date();
    // let day = this.todayDate.getDate();
    // let month = this.todayDate.getMonth();
    // if(day >=0 && day<10){
    //   day = "0" + day;
    // }
    // if(month.length == 1){
    //   month = "0" + month;
    // }
    // let dateToday = (this.todayDate.getFullYear() + '-' + ((month + 1)) + '-' + day + ' ' + this.todayDate.getHours() + ':' + this.todayDate.getMinutes() + ':' + this.todayDate.getSeconds());
    // let dateTodayCourt = (this.todayDate.getFullYear() + '-' + ((month + 1)) + '-' + day);
    // console.log(dateToday);
    // console.log(dateTodayCourt);
    // console.log(event);
    var i;
    for (i = 0; i < document.getElementsByClassName('task').length; i++) {
      let obj = {
        idTask: (<HTMLInputElement>document.getElementsByClassName('id')[i]).value,
        work: {
          date: new Date(),
          workedHoursByDay: +(<HTMLInputElement>document.getElementsByClassName('dura')[i]).value
        }
      };
      this.workedHours.push(obj);
    }
    console.log("ceci est le tab. construit");
    console.log(this.workedHours);
    this.taskDataService.saveWorkedHoursOfUser(this.id, this.workedHours)
      .subscribe(
        data => {
          console.log(data);
        }
      );
    this.workedHours = [];
  }

  ngAfterViewInit() { }

}
