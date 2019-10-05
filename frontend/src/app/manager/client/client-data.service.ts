import {Injectable} from "@angular/core";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import {Client} from "./client.model";
import {Subject} from "rxjs";
import {Project} from "../tache/projects/project.model";



@Injectable()
export class ClientDataService {

  clientEmitter = new Subject();
  clientEmitter3=new Subject();

  constructor(private httpClient: HttpClient) {
  }

  addClient(client) {
      const body = JSON.stringify(client);
      const headers = new HttpHeaders()
        .set('Authorization', 'my-auth-token')
        .set('Content-Type', 'application/json');

      return this.httpClient.post('http://127.0.0.1:3000/client/ajout', body, {headers: headers});
  }


  getClients() {
    return this.httpClient.get<Client[]>('http://127.0.0.1:3000/client/all');
  }

  addProjectToClient(clientName: string, idProject: string) {

    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');


    let body = JSON.stringify({
      clientName: clientName,
      idProject: idProject
    });

    return this.httpClient.post('http://127.0.0.1:3000/client/one', body, {headers: headers});
  }

  deleteClient(idClient: string) {
    return this.httpClient.get(`http://127.0.0.1:3000/client/delete/${idClient}`);
  }

  getClient(clientName:string){
    return this.httpClient.get(`http://127.0.0.1:3000/client/getOne/${clientName}`);
  }

}
