import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
//encapsulation: ViewEncapsulation.None
export class AccueilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
