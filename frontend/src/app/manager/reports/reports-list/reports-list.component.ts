import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ReportsDataService} from "../reports-data.service";
import { Report} from "../report.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})
export class ReportsListComponent implements OnInit,OnDestroy {

  constructor(private router:Router,
              private route:ActivatedRoute,
              private reportsDataService:ReportsDataService) { }
  reports:Report[];
  reportsSubscription:Subscription;

  ngOnInit() {
    this.reports=this.reportsDataService.getReports();
    this.reportsSubscription=this.reportsDataService.reportChanged.subscribe(
      (reports:Report[])=>{
        this.reports=reports;
        console.log(reports);
      }
    );
  }
  onNavigate(){
    this.router.navigate(['reports-types'],{relativeTo:this.route});
  }

  ngOnDestroy(){
    this.reportsSubscription.unsubscribe();
  }
}
