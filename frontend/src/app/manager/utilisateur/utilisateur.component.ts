import { Component, OnInit } from '@angular/core';
import { UserDataService } from './user-data.service';
import { NgForm, FormControlName, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { emailValidator, matchingPasswords } from '../shared/validateur';
import { Utilisateur } from "./utilisateur.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  idUser: number = 6;
  idUserModif;
  idUserSuppr;
  userSubscription: Subscription;

  tabUser: any[] = [];
  newTabUser: any[] = [];
  objUser: any;
  classRech: any; //recherche un élement dans un tableau par sa classe
  isSelected: any = "";
  registrationForm: FormGroup;
  verifExist: any = true;
  isdisplay: any = false;

  constructor(private utilisateurService: UserDataService, public fb: FormBuilder) {
    this.registrationForm = fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      poste: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])]
    });
  }

  ngOnInit() {
    /*this.userSubscription = this.utilisateurService.userChanged.subscribe((users: Utilisateur[]) => {
      this.tabUser = users;
    });*/
    this.utilisateurService.getTabUser().subscribe(
      data=>{
        this.tabUser=<Utilisateur[]>data;
      }
    );


  }

  onAddUser(nom, prenom, email, type, poste) {
    //test existance:
    for (let user of this.tabUser) {
      if (user.email === email.value) {
        this.verifExist = false;
        this.isdisplay = true;
      }
    }
    if (this.verifExist) {
      this.idUser++;
      this.objUser = new Utilisateur(this.idUser, nom.value, prenom.value, email.value, type.value, poste.value, 0,[]);
      this.utilisateurService.addNewUser(this.objUser).subscribe(
        data=>{
          this.tabUser=<Utilisateur[]>data;
        }
      )
    }
    this.verifExist = true;
    nom.value = "";
    prenom.value = "";
    email.value = "";
    poste.value = "";
  }

  onPreModif(event, nomm, prenomm, emailm, typem, postem) {
    this.classRech = event.target.className.toString();
    this.idUserModif = +event.target.className;
    console.log(event);
    //recherche dans tabUser
    for (let user of this.tabUser) {
      if (user.id === this.idUserModif) {
        nomm.value = user.nom;
        prenomm.value = user.prenom;
        emailm.value = user.email;
        postem.value = user.poste;
      }
    }
  }

  onModif(nomm, prenomm, emailm, typem, postem) {
    this.objUser = new Utilisateur(this.idUserModif, nomm.value, prenomm.value, emailm.value, typem.value, postem.value, 0,[]);
    //this.utilisateurService.updateUser(this.idUserModif, this.objUser);
    console.log("modification");
  }

  /*onPreSuppr(event) {
    console.log(event);
      this.classRech = event.target.className.toString();
    this.idUserSuppr = +event.target.className;
    //recherche dans tabUser
    for (let user of this.tabUser) {
      if (user.id === this.idUserSuppr) {
        this.isSelected = user.nom + " " + user.prenom;
      }
    }
  }*/

 /* onSuppr() {
    this.utilisateurService.deleteUser(this.idUserSuppr._id).subscribe(
      data=>{
        console.log(data);
      }
    );
  }*/

  selectedUserId;
  onPreSuppr(event, userid) {
    console.log("hhhhh")

    console.log(userid);
    this.selectedUserId=userid;
    console.log(this.selectedUserId)
    this.classRech = event.target.className.toString();
    this.idUserSuppr = +event.target.className;
    //recherche dans tabUser
    for (let user of this.tabUser) {
      if (user.id === this.idUser) {
        this.isSelected = user.nom + " " + user.prenom;
      }
    }
  }

  onSuppr()
  {
    console.log("onSupprime");

    this.utilisateurService.deleteUser(this.selectedUserId).subscribe(
      data => {
        console.log(data);
        this.tabUser = <Utilisateur[]>data;

      }
    );
  }



}
