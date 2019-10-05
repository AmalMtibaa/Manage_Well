import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
  name :'LastCharacterCut'}
)
export class LastCharacterCut implements PipeTransform{

  transform(value: any){
    const x= value.substring(0, value.length - 1);
    return x;
  }

}
