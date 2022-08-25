import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'revenueFormat'
})
export class RevenueFormatPipe implements PipeTransform {

  	transform(value: number | undefined): string {
    	if (!value) {
      		return 'N/A';
    	}
    	return '$' + value + 'M';
  	}

}