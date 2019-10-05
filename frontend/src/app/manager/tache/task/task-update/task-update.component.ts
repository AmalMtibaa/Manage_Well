import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormGroup, FormControl, NgForm} from "@angular/forms";
import {UserDataService} from "../../../utilisateur/user-data.service";
import {Utilisateur} from "../../../utilisateur/utilisateur.model";
import {TaskDataService} from "../task-data.service";
import {Task} from "../task.model";



@Component({
  selector: 'app-task-update',
  templateUrl: './task-update.component.html',
  styleUrls: ['./task-update.component.css']
})
export class TaskUpdateComponent implements OnInit {

  @Input('action')action;
  @Input('selectedTask')selectedTask;
  @Input()selectedProject;


  @ViewChild('form') updateTaskForm:NgForm;
  userTab;

  constructor(private userDataService:UserDataService,
              private taskDataService:TaskDataService) { }

  ngOnInit() {

    this.userDataService.getTabUser().subscribe(
      data=>{
        this.userTab=<Utilisateur[]>data;
      }
    );

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
    console.log(this.selectedTask._id);
   let task=this.updateTaskForm.value;
   task._id=this.selectedTask._id;
   console.log(task);

    this.taskDataService.updateTask(task).subscribe(
      ()=>{
        this.taskDataService.getTasksByProject(this.selectedProject._id).subscribe(
          data => {
            this.taskDataService.taskEmitter.next(data);
          }
        );
      }
    );
  }

onClose(){
    this.updateTaskForm.reset();
}
}
