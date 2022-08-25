import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieDetails } from '../definitions';

@Component({
  	selector: 'app-movie-detail',
  	templateUrl: './movie-detail.component.html',
  	styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent {
	@Input() isDetailDisplayed = false;
	@Input() movie!: MovieDetails | null;
  	@Output() onDetailClose = new EventEmitter();

    readonly closeIconUrl = '../../assets/close.svg';
}
