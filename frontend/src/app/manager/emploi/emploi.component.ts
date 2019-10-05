import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { UserDataService } from '../utilisateur/user-data.service';
import { Subject } from 'rxjs';
import {ProjectDataService} from "../tache/projects/project-data.service";
import {Project} from "../tache/projects/project.model";
declare var jquery: any;
declare var $: any;
declare var initThemeChooser: any;

@Component({
  selector: 'app-emploi',
  templateUrl: './emploi.component.html',
  styleUrls: ['./emploi.component.css']
})
export class EmploiComponent implements OnInit, AfterViewInit {

  view: string = 'week';

  viewDate: Date = new Date();

  /*events: CalendarEvent[] = [
    {
      title: "hhhhhhh",
      start: new Date()
    }
  ];*/

  clickedDate: Date;

  tabUser: any[] = [];
  tabProjet: any[] = [];
  tabTacheSel: any[] = [];
  tacheSel: string = "";

  refresh: Subject<any> = new Subject();

  count: number;

  constructor(private utilisateurService: UserDataService, private projectDataService:ProjectDataService) { }

  ngOnInit() {
   // this.tabUser = this.utilisateurService.tabUser;
    this.projectDataService.getProjects().subscribe(
        data=>{
          this.tabProjet=<Project[]>data;
        }
    );
  }

  onSelProj(sel) {
    const rech = sel.value;
    for (let proj of this.tabProjet) {
      if (proj.nom == rech) {
        this.tabTacheSel = proj.tache;
      }
    }
  }

  onSelTache(selT) {
    const tach = selT.value;
    this.tacheSel = tach;
    if (tach != "Choisir") {
      console.log(this.tacheSel);
    } else {
      this.tacheSel = "";
    }
  }

  onAddTache(start, deadline) {
    const newTache = {
      title: this.tacheSel,
      start: new Date(start.value),
      end: new Date(deadline.value)
    };
   // this.events.push(newTache);
    this.refresh.next();
  }

  getClickedDate(date) {
    console.log(date.value);
  }

  onSaveWork(event){
    // for(let t of task.value){
    //   console.log(t);
    // }
    // for(let d of dura.value){
    //   console.log(d);
    // }
    console.log("works fine!");
    console.log(event);
  }

  ngAfterViewInit() { }

}
