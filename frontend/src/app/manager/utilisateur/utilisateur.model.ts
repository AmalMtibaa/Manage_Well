export class Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  type: string;//Admin normall..
  poste: string;
  horaire: number; //should be removed later
  projectsId:string[];
  tasksId:string[];

  constructor(id: number, nom: string, prenom: string, email: string, type: string, poste: string, horaire: number, projectsId:string[]) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.type = type;
    this.poste = poste;
    this.horaire = horaire;
    this.projectsId=projectsId;
    this.tasksId=[];
  }

  public getNom(): string {
    return this.nom;
  }

  public getHoraire(): number {
    return this.horaire;
  }

  public getPrenom(): string {
    return this.prenom;
  }
}
