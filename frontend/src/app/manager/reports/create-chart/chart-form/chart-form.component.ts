import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import 'chart.js';
import {UserDataService} from "../../../utilisateur/user-data.service";
import {CreateChartService} from "../create-chart.service";
import {ProjectDataService} from "../../../tache/projects/project-data.service";
import {Subscription} from "rxjs";

import * as jsPDF from 'jspdf';
import {BaseChartDirective} from "ng2-charts";
import {Utilisateur} from "../../../utilisateur/utilisateur.model";
import {Project} from "../../../tache/projects/project.model";
import {Task} from "../../../tache/task/task.model";
//import * as html2canvas from 'html2canvas';

@Component({
  selector: 'app-chart-form',
  templateUrl: './chart-form.component.html',
  styleUrls: ['./chart-form.component.css']
})
export class ChartFormComponent implements OnInit,OnDestroy {

  constructor(private userDataService: UserDataService,
              private createChartService: CreateChartService,
              private projectsDataService: ProjectDataService) {
  }

  users; //list of Usres
  usersNames; //list of usersName
  usersHoraire=[];


  date=new Date();
  //curent Month
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

  projectsList;
  projectsNames;
  projectsTotalWorkedHours;

  barChartLabels = this.usersNames;
  barChartData: any[] = [
    {
      data: this.usersHoraire,
      label: 'Total working Hour by Users '
    }
  ];


  selectedStaff: string[] = this.barChartLabels;

  selectedStaffHoraire: number[];// for Users
  selectedStaffHours ; //for Projects
  selectedStaffId: string[];

  selectedBy: string = 'Users';
  chartFormSubscription: Subscription;

  typeSelectStaff: string = "All Staff"; //All staff or selectedStaff
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  s: Subscription;


  ngOnInit() {
    this.projectsDataService.getProjects().subscribe(
      data=>{
        this.projectsList=<Project[]>data;
        this.projectsNames=this.projectsList.map(project =>project.name);
      });

    this.userDataService.getAllUsersWorkedHours(this.firstDay,this.lastDay); //this method will emmit  usersHoraire
    this.userDataService.userHoraireEmitter.subscribe(
      data=>{
        this.usersHoraire=<number[]>data;
        console.log('usersHoraire');
        console.log(this.usersHoraire);
        this.barChartData = [
          {
            data: this.usersHoraire,
            label: 'Total working Hour by Users '
          }
        ];

        this.barChartOptions= {
          scaleShowVerticalLines: false,
          responsive: true,

          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                max:this.usersHoraire[0]
              }
            }],
          }
        };

        //In each Subscribe Method You should use this setTimeOut Method
        setTimeout(() => {
          if (this.chart && this.chart.chart && this.chart.chart.config) {
            if(this.barChartType=='bar'){
              this.chart.chart.config.data.labels = this.barChartLabels;
              this.chart.chart.config.data.options=this.barChartOptions;
            }
            //this.chart.chart.config.data.datasets = this.barChartData;
            this.chart.chart.update();
          }
        });
      });

    this.userDataService.getTabUser().subscribe(
      data=>{

        this.users=<Utilisateur[]>data;
        this.usersNames=this.users.map(user =>user.nom+" "+user.prenom);
        this.barChartLabels = this.usersNames;
        this.selectedStaff= this.barChartLabels;

        setTimeout(() => {
          if (this.chart && this.chart.chart && this.chart.chart.config) {
            if(this.barChartType=='bar'){
              this.chart.chart.config.data.labels = this.barChartLabels;
              this.chart.chart.config.data.option=this.barChartOptions;
            }
            //this.chart.chart.config.data.datasets = this.barChartData;
            this.chart.chart.update();
          }
        });

      });

    this.projectsDataService.getTotalProjectsWorkedHours();
    this.projectsDataService.projectHoraireEmitter.subscribe(
      data=>{
        this.projectsTotalWorkedHours=<number[]>data;

        setTimeout(() => {
          if (this.chart && this.chart.chart && this.chart.chart.config) {
            if(this.barChartType=='bar'){
              this.chart.chart.config.data.labels = this.barChartLabels;
              this.chart.chart.config.data.options=this.barChartOptions;
            }
            //this.chart.chart.config.data.datasets = this.barChartData;
            this.chart.chart.update();
          }});
      });



    this.createChartService.chartEmitter3.subscribe( //to get the selected staff that have been choose called every check x

      (data: {
        checkList: string[],
        checkedListHoraire: number[],
        checkedListId: string[]}) => {


        this.selectedStaff = data.checkList;
        this.selectedStaffHoraire = data.checkedListHoraire;
        this.selectedStaffId = data.checkedListId;

        if (this.selectedBy == 'Users') {
          this.barChartLabels = this.selectedStaff;
          this.barChartData = [
            {
              data: this.selectedStaffHoraire,
              label: 'Total working Hour by Users '
            }

          ];


        }
        else { //SelectedBy=='Projects'

          this.selectedStaffId = data.checkedListId;

          this.projectsDataService.calculateTotalWorkedHoursByStaff(this.selectedStaffId);
          this.projectsDataService.projectForSelectedUserEmitter.subscribe(
            data=>{
              console.log("-----------selectedStaffHours");
              this.selectedStaffHours=<number[]>data;
              console.log(this.selectedStaffHours);

              this.barChartLabels = this.projectsNames;
              this.barChartData = [
                {
                  data: this.selectedStaffHours,
                  label: 'Total working Hour by Projects '
                }];

              setTimeout(() => {
                if (this.chart && this.chart.chart && this.chart.chart.config) {
                  if(this.barChartType=='bar'){
                    this.chart.chart.config.data.labels = this.barChartLabels;
                  }
                  this.chart.chart.config.data.data = this.barChartData;
                  this.chart.chart.update();
                }
              }); //end SetTimeout

            });
          //this.selectedStaffHours = this.projectsDataService.calculateTotalWorkedHoursByStaff(this.selectedStaffId);
        }


          setTimeout(() => {
            if (this.chart && this.chart.chart && this.chart.chart.config) {
              if(this.barChartType=='bar'){
                this.chart.chart.config.data.labels = this.barChartLabels;
              }
              //this.chart.chart.config.data.datasets = this.barChartData;
              this.chart.chart.update();
            }
          }); //end SetTimeout

      });

    this.createChartService.chartEmitter4.subscribe( // All Staff and selectedStaff actions
      (type: string) => {
        this.typeSelectStaff = type;
        if (this.typeSelectStaff == 'All Staff') {
          if (this.selectedBy == 'Users') {
            this.barChartLabels = this.usersNames;
            this.barChartData = [
              {
                data: this.usersHoraire,
                label: 'Total working Hour by Users'
              }
            ];
            this.selectedStaff=[];
          }
          else {


            this.barChartLabels = this.projectsNames;
            this.barChartData = [
              {
                data: this.projectsTotalWorkedHours,
                label: 'Total working Hour by Projects'
              }
            ];

          }
        }
        //Should see this
        else {   //SelectedStaff

            this.barChartLabels = [];
            this.barChartData = [
              {
                data: [],
                label: 'Total working Hour by Users'
              }
            ];
          }

          setTimeout(() => {
            if (this.chart && this.chart.chart && this.chart.chart.config) {
              this.chart.chart.config.data.labels = this.barChartLabels;
              //this.chart.chart.config.data.datasets = this.barChartData;
              this.chart.chart.update();
            }
          });

      }
    );

    this.chartFormSubscription = this.createChartService.chartEmitter.subscribe( //get The selectedId(Users or Projects)
      (id: string) => {
        this.selectedBy = id;
        console.log("selected by" + this.selectedBy);
        if (this.selectedBy === 'Users') {

          if (this.typeSelectStaff == 'Selected Staff') {
            this.barChartLabels = this.selectedStaff;
            this.barChartData = [
              {
                data: this.selectedStaffHoraire,
                label: 'Total working Hour by Users'
              }

            ];

          }
          else {
            this.barChartLabels = this.usersNames;
            this.barChartData = [
              {
                data: this.usersHoraire,
                label: 'Total working Hour by Users'
              }
            ];

          }
        }
        else {


          console.log(this.barChartOptions);
          if (this.typeSelectStaff == 'All Staff') {
            this.barChartLabels = this.projectsNames;
            this.barChartData = [
              {
                data: this.projectsTotalWorkedHours,
                label: 'projects'
              }
            ];
          }
          else {
            this.barChartLabels = this.projectsNames;
            this.barChartData = [
              {
                data: this.projectsDataService.calculateTotalWorkedHoursByStaff(this.selectedStaffId),
                label: 'projects'
              }
            ];
          }
        }

          setTimeout(() => {
            if (this.chart && this.chart.chart && this.chart.chart.config) {
              this.chart.chart.config.data.labels = this.barChartLabels;
              //this.chart.chart.config.data.datasets = this.barChartData;
              this.chart.chart.update();
            }
          });

      });


  } //ngOnInitEnd

  private barChartOptions;

  private barChartType: string = 'bar';
  private barChartLegend: boolean = true;

  // events
  private chartClicked(e: any): void {
    console.log(e);
  }

  private chartHovered(e: any): void {
    console.log(e);
  }

  ngOnDestroy() {
    this.chartFormSubscription.unsubscribe();
  }

  genPDFi() {

  }




  onSelectChange(type:string) {
   this.barChartType=type;
   if(this.barChartType=='pie'||this.barChartType=='doughnut') {
     this.barChartOptions ={
       scaleShowVerticalLines: false,
       responsive: true
     };
   }
   else{
     this.barChartOptions = {
       scaleShowVerticalLines: false,
       responsive: true,

       scales: {
         yAxes: [{
           ticks: {
             beginAtZero: true
           }
         }],
       }
     };
   }

  }


}
