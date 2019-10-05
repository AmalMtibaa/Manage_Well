import {Component, OnInit, Input} from '@angular/core';
import {Report} from "../../report.model";
import {ReportsDataService} from "../../reports-data.service";


@Component({
  selector: 'app-report-item',
  templateUrl: 'report-item.component.html',
  styleUrls: ['report-item.component.css']
})
export class ReportItemComponent implements OnInit {

  @Input() selectedReport:Report;
  @Input()selectedReportId:number;

  constructor(private reportDataService:ReportsDataService) { }

  ngOnInit() {
  }

  onDelete(s){
    console.log('onDelete'+ s);
    this.reportDataService.deleteReport(s);
  }

}
