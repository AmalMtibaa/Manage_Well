import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, FormControl} from "@angular/forms";
import {UserDataService} from "../../../utilisateur/user-data.service";
import {Utilisateur} from "../../../utilisateur/utilisateur.model";
import {TaskDataService} from "../task-data.service";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-task-create',
  templateUrl: 'task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {

  addTaskForm:FormGroup;
  constructor(private userDataService:UserDataService,
              private taskDataService:TaskDataService,
              private datePipe: DatePipe) { }
  userTab;



  @Input()selectedProject;


  ngOnInit() {

    this.addTaskForm=new FormGroup({
        'name':new FormControl(''),
        'selectedStaff':new FormControl('All Staff'),
        'duration':new FormControl(''),
        'deadline':new FormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
    });

    this.userDataService.getTabUser().subscribe(
      data=>{
        this.userTab=<Utilisateur[]>data;
      }
    );

  }

  checkedList=[];
  onCheckboxChange(option, event) {
    if (event.target.checked) {
      this.checkedList.push(option);
    } else {
      for (var i = 0; i < this.userTab.length; i++) {
        if (this.checkedList[i] == option) {
          this.checkedList.splice(i, 1);
        }
      }
    }
    console.log(this.checkedList);
  }

  onSubmit(){

      console.log('We are in the create Method');
      let usersWorkedHours = [];
      if (this.addTaskForm.get('selectedStaff').value === 'Selected Staff') {
        for (let i = 0; i < this.checkedList.length; i++) {
          usersWorkedHours.push({idUser: this.checkedList[i], workedHours: []});
        }
      }
      else {
        for (let j = 0; j < this.userTab.length; j++) {
          usersWorkedHours.push({idUser: this.userTab[j]._id, workedHours: []});
        }
      }


      this.addTaskForm.addControl('projectId', new FormControl(this.selectedProject._id));
      this.addTaskForm.addControl('usersWorkedHours', new FormControl(usersWorkedHours));
      this.addTaskForm.addControl('status', new FormControl(true));
      this.addTaskForm.addControl('creationDate', new FormControl(new Date()));


      console.log(this.addTaskForm.value);
      this.taskDataService.addTask(this.addTaskForm.value).subscribe(
        () => {
          this.taskDataService.getTasksByProject(this.selectedProject._id).subscribe(
            data => {
              this.taskDataService.taskEmitter.next(data);
            }
          );
        }
      );


      //Because we are calling this form in Mondal , ngOnInit won't be excused every time we click Add Task
      this.addTaskForm.reset();
      this.checkedList = [];
      usersWorkedHours = [];
      this.addTaskForm = new FormGroup({
        'name': new FormControl(''),
        'selectedStaff': new FormControl('All Staff'),
        'duration': new FormControl(''),
        'deadline': new FormControl('')
      });
    }



}
