import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormArray} from "@angular/forms";
import {Client} from "./client.model";
import {ClientDataService} from "./client-data.service";


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  form: FormGroup;

  constructor(private clientDataService:ClientDataService) {
  }

  ngOnInit() {
    this.form = new FormGroup(
      {
        'name': new FormControl(''),
        'description': new FormControl(''),
        'projectsID': new FormArray([])
      });

  }

  onAddClient(){
    let name=this.form.get('name').value;
    let description=this.form.get('description').value;
    let client=new Client(name,description);
    this.clientDataService.addClient(client).subscribe(
        data => {
          console.log(data);
          let clientList=<Client[]>data;
          this.clientDataService.clientEmitter.next(clientList);
        },
        error => console.error(error)
      );
    this.form.reset();

  }

}
