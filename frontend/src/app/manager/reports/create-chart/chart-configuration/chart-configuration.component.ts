import { Component, OnInit } from '@angular/core';
import {CreateChartService} from "../create-chart.service";
import {UserDataService} from "../../../utilisateur/user-data.service";
import {FormGroup, FormControl} from "@angular/forms";
import {ReportsDataService} from "../../reports-data.service";
import {ProjectDataService} from "../../../tache/projects/project-data.service";
import {Project} from "../../../tache/projects/project.model";
import {Utilisateur} from "../../../utilisateur/utilisateur.model";


@Component({
  selector: 'app-chart-configuration',
  templateUrl: './chart-configuration.component.html',
  styleUrls: ['./chart-configuration.component.css']
})
export class ChartConfigurationComponent implements OnInit {

  ngOnInit() {


      this.userDataService.getTabUser().subscribe(
        data=>{
          this.userTab =<Utilisateur[]>data;
        }
      );
    this.projectDataService.getProjects().subscribe(
        data=>{
          this.projectsTab=<Project[]>data;
        }
    );
    this.form=new FormGroup(
      {
        'dataRange':new FormControl('Current month'),
        'selectedStaff':new FormControl('All Staff'),
        'totalWorkingHours':new FormControl('Total working hours'),
        'by':new FormControl('Users')
      });
    this.dataRange=this.reportDataService.getDataRange();

    let startDate;
    let endDate;
    this.userDataService.getAllUsersWorkedHours(startDate,endDate);
    this.userDataService.userHoraireEmitter.subscribe(
      data=> {
        this.usersListHoraire=<number[]>data;
      })

  }
  dataRange;
  form:FormGroup;
  checkedList=[];
  checkedListId=[];
  checkedListHoraire=[];
  userTab=[];
  projectsTab=[];
  usersListHoraire=[];

  selctedStaffTypeChanged:boolean=false; //to initialize the onCheckboxChange Method

  constructor(private userDataService:UserDataService,
              private createChartService:CreateChartService,
              private reportDataService:ReportsDataService,
              private projectDataService:ProjectDataService){}

  OnBySelected(sel){
    this.createChartService.chartEmitter.next(sel.value);
  }

  /*onSortSelected(sel2){
    this.createChartService.chartEmitter2.next(sel2.value);
  }*/

  onCheckboxChange(option, event,bool,index) {
    if(bool){
      this.checkedList=[];
      this.checkedListId=[];
      this.checkedListHoraire=[];
      bool=false;
      this.selctedStaffTypeChanged=false;
    }
    if (event.target.checked) {
      this.checkedListId.push(option._id);
      this.checkedList.push(option.nom+" "+option.prenom);
      this.checkedListHoraire.push(this.usersListHoraire[index]);
    } else {
      for (let i = 0; i < this.userTab.length; i++) {
        if (this.checkedListId[i] == option._id) {

          this.checkedList.splice(i, 1);
          this.checkedListId.splice(i, 1);
          this.checkedListHoraire.splice(i, 1);
        }
      }
    }
    let result=this.cloneTab(this.checkedListHoraire);
    if(this.checkedList.length==0){
      result=[];
    }
    console.log(this.checkedList+ "---- first checkedList");
    console.log(result);
    console.log(this.checkedListId);
    this.createChartService.chartEmitter3.next(
      {
        checkList: this.checkedList,
        checkedListHoraire:result,
        checkedListId: this.checkedListId
      });
  }


  onSelectTypeStaff(sele){
    this.createChartService.chartEmitter4.next(sele.value);
    this.selctedStaffTypeChanged=true;
  }

  cloneTab(tab:number[]){
    let result=[];
    for(let i in tab){
      result.push(tab[i]);
    }
    return result;
  }

}
