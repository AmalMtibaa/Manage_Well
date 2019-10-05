import {Component, OnInit, OnDestroy} from '@angular/core';
import {NgForm, FormControlName, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { emailValidator, matchingPasswords } from '../shared/validateur';
import {ProjectDataService} from "./projects/project-data.service";
import {Project} from "./projects/project.model";
import {Task} from "./task/task.model";
import {Subscription} from "rxjs";
import {ClientDataService} from "../client/client-data.service";
import {Client} from "../client/client.model";
import {UserDataService} from "../utilisateur/user-data.service";
import {Utilisateur} from "../utilisateur/utilisateur.model";
import {TaskDataService} from "./task/task-data.service";
import {Router, ActivatedRoute} from "@angular/router";
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-tache',
  templateUrl: './tache.component.html',
  styleUrls: ['./tache.component.css']
})
export class TacheComponent implements OnInit ,OnDestroy{


  taskSubscription:Subscription;
  projectSubscription:Subscription;
  clientSubscription:Subscription;
  clientEmitterSubscription:Subscription;

  projectsList: Project[]; //list off all Projects
  fullTasksList:Task[]; //list off all Task
  clientList; //list of all Clients
  usersList;

  projetAffich: Project;  //selectedClient
  isSuppr: boolean= false;


  selectedClientName="All Clients";
  selectedClientFullTasks;
  ngOnInit() {

   this.projectSubscription= this.projectDataService.getProjects().subscribe(
        data=>{
          console.log(data);
          this.projectsList=<Project[]>data;
        }
    );
   this.clientSubscription=this.clientDataService.getClients().subscribe(
          data=>{
            this.clientList=<Client[]>data;
          }
        );
   this.clientEmitterSubscription=this.clientDataService.clientEmitter.subscribe(
          data=>{
            this.clientList=<Client[]>data;
          }
        );
    this.userDataService.getTabUser().subscribe(
      data=>{
        this.usersList=<Utilisateur[]>data
      }
    );

    this.projectDataService.updateProjectEmitter.subscribe(
      data=>{
        this.projectsList=<Project[]>data;
        this.testValue=false;
      }
    );

    this.projectDataService.addProjectEmitter.subscribe(
      data=>{
        this.clientList=<Client>data;
        this.testValue=false;
      }
    );

    this.taskSubscription=this.taskDataService.taskEmitter.subscribe(
      data=>{
        this.tasksList=<Task[]>data;
      }
    );

    this.taskDataService.getTasks().subscribe(
      data=>{
        this.fullTasksList=<Task[]>data;
        this.selectedClientFullTasks=this.fullTasksList;
      }
    );

  }

  constructor(
              private projectDataService:ProjectDataService,
              private clientDataService:ClientDataService,
              private userDataService:UserDataService,
              private taskDataService:TaskDataService,
              private router:Router,
              private route:ActivatedRoute) {}


  onDeleteProject(projectId:string, clientName:string) {
    this.projectDataService.deleteProject(projectId,clientName).subscribe(
      data=>{
        this.clientList=<Client[]>data;
        this.testValue=false;
        this.isSuppr=false;
        this.selectedClientName="All Clients";
        this.selectedClientFullTasks=this.fullTasksList;
      }
    );

  }

selectedTaskToDelete="";

  onPreSupprTache(selectedTask){
    this.selectedTaskToDelete=selectedTask;
  }
selectedTaskToUpdate;

    onUpdateTask(selectedTask:Task){
      console.log("##############  "+selectedTask.name);
   this.selectedTaskToUpdate=selectedTask;
   //this.taskDataService.taskUpdateEmitter.next(selectedTask);
    this.onSelectedAdd('update_Task');
  }

  onDeleteTask() {
    this.taskDataService.deleteTask(this.selectedTaskToDelete).subscribe(
      ()=>{
        this.taskDataService.getTasksByProject(this.projetAffich._id).subscribe(
            data=> {
                this.tasksList=<Task[]>data;
            });
          });
    }


whatToShowInModal:number=0;

  onSelectedAdd(type:string){
    if(type=='add_client'){
      this.whatToShowInModal=1;
    }
    if(type=='add_project'){
      this.whatToShowInModal=2;
    }
    if(type=='update_project'){
      this.whatToShowInModal=3;
    }
    if(type=='Add_Task'){
      this.whatToShowInModal=4;
    }
    if(type=='update_Task'){
      this.whatToShowInModal=5;
    }
}
selected0;
  selected1;
result=[];
//Show projects of each Client
showProject(clt, projectsClient:string[], id,clientName) {
  this.selected0 = clientName;
  this.selectedClientName=clientName;

  this.taskDataService.getTasksByClient(id).subscribe(
    data=>{
      console.log(data);
      this.selectedClientFullTasks=<Task[]>data
    }
  );
  this.Affich(clt);
if((!this.result.length)||(this.selected0 != this.selected1)){
  this.selected1 = this.selected0;
  this.projectDataService.getProjectsNameByID(projectsClient).subscribe(
    data => {

      console.log(data);
      this.result=<Project[]>data;
      for(let c of this.clientList){
        if (c._id === id){
          c.result=<Project[]>data;

        }
      }
    });
}

}


testValue=false;
  Affich(clt){
    console.log(clt.aff);
    clt.aff=!clt.aff;
    console.log(clt.aff);
  }

  onSelectProject(project){
    this.projetAffich=project;
    console.log(project);
    this.isSuppr= true;
    this.getTasksByProject(project._id);
    this.router.navigate(['project-detail',project._id],{relativeTo:this.route});
  }

  deleteClient(idClient:string,clientProjectsID:string[]){

    if(clientProjectsID.length!=0){
      alert("You cant't delete this Client because he has "+clientProjectsID.length +" projects");
    }
    else{
      this.clientDataService.deleteClient(idClient).subscribe(
        data=>{
          console.log(data);
          this.clientList=<Client[]>data;
        }
      );
    }

  }

  open=false;
  onConfiguartionClicked(clientName){

    console.log(clientName);
    if(!this.open){
     // this.clientDataService.clientEmitter3.next(clientName);
      this.router.navigate(['client-detail',clientName],{relativeTo:this.route});
      this.open=true;
    }
    else{
      this.router.navigate(['/manager/tache']);
      this.open=false;
    }

  }

  tasksList=[];

 getTasksByProject(idProject:string){

    this.taskDataService.getTasksByProject(idProject).subscribe(
      data=>{
        this.tasksList=<Task[]>data;
        console.log(data);
      }
    );
  }

  ngOnDestroy(){
    this.projectSubscription.unsubscribe();
    this.clientSubscription.unsubscribe();
    this.clientEmitterSubscription.unsubscribe();
    this.taskSubscription.unsubscribe();
}
}
