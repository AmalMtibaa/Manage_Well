import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class ConnexionService {

  body: any;

  constructor(private http: Http) { }

  getClient(){
    return this.http.get('http://localhost:3000/clients')
      .pipe(
        map((response: Response) => response.json())
      );
  }

  ajouterClient(message: any) {
    console.log(message);
    this.body = JSON.stringify(message);
    console.log(this.body);
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('http://localhost:3000/clients', this.body, {headers: headers}).pipe(
      map((response: Response) => response.json())
    );
  }

    updateValeur(message: any){
      this.body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.patch('http://localhost:3000/message/' + message.email, this.body, {headers: headers}).pipe(
          map((response: Response) => response.json())
        );
    }

}
