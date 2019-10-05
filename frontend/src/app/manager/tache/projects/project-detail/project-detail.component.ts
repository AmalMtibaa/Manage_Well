import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {ClientDataService} from "../../../client/client-data.service";
import {Client} from "../../../client/client.model";

import {Project} from "../project.model";
import {Subscription} from "rxjs/index";
import {ProjectDataService} from "../project-data.service";

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  clientList=[];
  projetAffich: Project;

  clientName;
  idProject;




  selectedProject = new Project('', '', 0 , '','Close',[],new Date(),new Date(),0,[]);

  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectDataService:ProjectDataService,
              private clientDataService: ClientDataService,

  ) {
  }



  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {

        this.idProject = params['idProject'];
        this.projectDataService.getProject(this.idProject).subscribe(
          data => {
            this.selectedProject = <Project>data;
            this.projetAffich = this.selectedProject[0];
          }
        );
      });


  }

  /*onDeleteProjet(projectId:string,clientName:string) {

    this.projectDataService.deleteProject(projectId,clientName).subscribe(
      data=>{
        this.clientList=<Client[]>data;


      }
    );

  }
*/

  // onDeleteProjet(idProject:string,clientName:string) {
  //   this.route.params.subscribe(
  //     (params: Params) => {
  //       this.idProject = params['idProject'];
  //       this.clientName = params['clientName'];
  //       this.projectDataService.deleteProject(idProject,clientName).subscribe(
  //         data => {
  //           this.clientList = <Client[]>data;
  //           console.log("khoulhhfjdg");
  //
  //         }
  //       );
  //     });
  // }


  fermer1() {
    this.router.navigate(['/manager/tache']);
  }






}
