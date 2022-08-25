import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  	name: 'removeCommas'
})
export class RemoveCommasPipe implements PipeTransform {

	transform(actors: string | undefined): string {
		if (!actors) {
	  		return '';
		}
		return actors.replace(/,/g, '');;
  	}

}