import {Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {FormGroup, FormControl, FormArray, NgForm} from "@angular/forms";
import {ClientDataService} from "../../../client/client-data.service";
import {Client} from "../../../client/client.model";
import {ProjectDataService} from "../project-data.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-project-create-update',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css']
})
export class ProjectCreateComponent implements OnInit{

  @Input('action')action;
  @Input('projectToUpdate')projectToUpdate;

  @ViewChild('formProject') formProject:NgForm;
  clientsList:Client[];

  todayDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  constructor(private clientDataService:ClientDataService,
              private projectDataService:ProjectDataService,
              private datePipe: DatePipe) {

  }

  ngOnInit() {
  this.clientDataService.getClients().subscribe(
      (data:Client[])=>{
        console.log(data);
        this.clientsList=<Client[]>data;
      }
    );

  }

  idProject:string;
  clientName:string;

  onSubmit(sel) {
    if(this.action==='create'){

      let projectJSON=this.formProject.value;
      projectJSON.client=sel.value;
      console.log(projectJSON);
      this.projectDataService.addProject(projectJSON)
        .subscribe(
          (res :any) => {
            this.idProject=res.result._id;
            this.clientName=res.result.client;
            //after adding the project to the database we should add the id of the project to the Client
            this.clientDataService.addProjectToClient(this.clientName,this.idProject).subscribe(
              data=>{
                this.projectDataService.addProjectEmitter.next(data);
              }
            );

          },
          err => {
            console.log("Error occured");
            console.log(err);
          }
        );
      this.formProject.setValue({
        name:'',
        status:'Open',
        duration:'',
        startDay:this.todayDate,
        deadline:this.todayDate,
      });
    }
    if(this.action==='update'){

      let projectJSON=this.formProject.value;
      projectJSON.idProject=this.projectToUpdate._id;
      console.log(projectJSON);


      this.projectDataService.updateProject(this.formProject.value)
        .subscribe(
          (res :any) => {
            this.projectDataService.updateProjectEmitter.next(res);
          },
          err => {
            console.log("Error occured");
            console.log(err);
          }
        );

    }



  }







}
