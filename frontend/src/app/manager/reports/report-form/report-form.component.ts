import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params} from "@angular/router";
import {ReportsDataService} from "../reports-data.service";

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {

  constructor(
              private route: ActivatedRoute,
              private reportDataService:ReportsDataService) {
  }

  dataGrouping1:string;
  dataGrouping2:string;

  idTypeReport: number;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.idTypeReport = params['id'];
      });
    this.reportDataService.reportEmitter.subscribe(
      (id:number)=>{
        this.dataGrouping1=this.reportDataService.getDataGroupingMember(id);
      }
    )
    this.reportDataService.reportEmitter2.subscribe(
      (id:number)=>{
        this.dataGrouping2=this.reportDataService.getDataGroupingMember2(id);
      }
    )
  }

}
