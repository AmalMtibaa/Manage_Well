import { Component, OnInit } from '@angular/core';
import {ClientDataService} from "../client-data.service";
import {Client} from "../client.model";
import {ActivatedRoute, Params, Router} from "@angular/router";


@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  clientName;
  clientList;
  selectedClient = new Client('', '');

  constructor(private route: ActivatedRoute,
              private router: Router,
              private clientDataService: ClientDataService) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {

        this.clientName = params['clientName'];
        this.clientDataService.getClient(this.clientName).subscribe(
          data => {
            this.selectedClient = <Client>data;
            console.log(this.selectedClient);
          });
      });

  }

  fermer() {
    this.router.navigate(['/manager/tache']);
  }

  deleteClient(idClient: string, clientProjectsID: string[]) {

    if (clientProjectsID.length != 0) {
      alert("You cant't delete this Client because he has " + clientProjectsID.length + " projects");
    }
    else {
      this.clientDataService.deleteClient(idClient).subscribe(
        data => {
          console.log("######################################");
          console.log(data);
          this.clientList = <Client[]>data;
        }
      );
      window.location.reload(true);
    }
  }

}
