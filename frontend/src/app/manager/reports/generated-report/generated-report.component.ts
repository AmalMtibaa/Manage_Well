import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generated-report',
  templateUrl: './generated-report.component.html',
  styleUrls: ['./generated-report.component.css']
})
export class GeneratedReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  AddReport(){
    console.log('Report has been written');
  }
}
