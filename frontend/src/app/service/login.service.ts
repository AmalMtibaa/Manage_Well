import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var jquery: any;
declare var $: any;

@Injectable()
export class LoginService {

  constructor(private router: Router) { }

  isAuthenticated() {
    return true;
  }

  signin(user) {
    // const body = JSON.stringify(user);
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // return this.http.post('http://localhost:3000/user/signin', body, { headers: headers })
    //   .map((response: Response) => response.json())
    //   .catch((error: Response) => {
    //     this.errorService.handleError(error.json());
    //     return Observable.throw(error.json());
    //   });
    return {"msg": "OK"};
  }

}
