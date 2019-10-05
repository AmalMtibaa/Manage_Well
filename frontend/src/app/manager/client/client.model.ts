export class Client{

  _id:string;
  name:string;
  description:string;
  projectsID:string[];

  public constructor(name:string,description:string){
    this.name=name;
    this.description=description;
    this.projectsID=[];
  }

}
