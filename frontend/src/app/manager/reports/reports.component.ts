import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-report',
  templateUrl: 'reports.component.html',
  styleUrls: ['reports.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {
  }

}
