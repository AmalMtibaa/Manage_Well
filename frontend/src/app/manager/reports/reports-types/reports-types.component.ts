import {Component, OnInit, Input} from '@angular/core';
import {ReportsDataService} from "../reports-data.service";

@Component({
  selector: 'app-reports-types',
  templateUrl: './reports-types.component.html',
  styleUrls: ['./reports-types.component.css']
})
export class ReportsTypesComponent implements OnInit {

  reportsType=[];

  constructor(private reportsDataService:ReportsDataService) { }

  ngOnInit() {
    this.reportsType=this.reportsDataService.getReportsTypes();
  }

}
