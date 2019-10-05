import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  loginObj: any;


  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(email, password){
    this.loginObj = {
      email: email.value,
      password: password.value
    };
    console.log(this.loginObj);
    if ((email.value === "support@talentcare.eu") && (password.value === "12345")){
      this.router.navigate(['/manager']);
    }
    else{
      alert("non");
    }
  }

}
