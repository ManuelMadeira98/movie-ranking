import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { concatMap, filter, Observable } from 'rxjs';
import { Movie, MovieDetails } from '../definitions';
import { ApiManager } from './api-manager.service';
import { IntersectionObserverService } from './intersection-observer.service';

@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
    @ViewChild('sentinel', {read: ElementRef}) sentinel!: ElementRef;

    readonly openIconUrl = '../../assets/open.svg';
    readonly resetIconUrl = '../../assets/reset.svg';

    isTopRevenueFilterActive = false;
    isTopRevenueByYearFilterActive = false;
    isDetailDisplayed = false;
    isYearPickerDisplayed = false;
    isSentinelNeeded = false;

    fallbackMovieList: Movie[] = [];
    movieList: Movie[] = [];

    selectedMovie$!: Observable<MovieDetails>;

    constructor(private apiManager: ApiManager, private intersectionObserver: IntersectionObserverService) {}

    ngOnInit(): void {
        /* Get initial page of movies */
        this.apiManager.fetchMovies().subscribe(movieList => {
            if (movieList) {
                this.movieList.push(...movieList.content);
                this.fallbackMovieList.push(...movieList.content);
            }
        });
    }

    ngAfterViewInit(): void {
        /* Wait a bit for the rendering before displaying sentinel */
        setTimeout(() => {
            this.isSentinelNeeded = true;
        }, 500);

        /**
         * Intersection observer listens to an intersection of the template sentinel.
         * When visible, request subsequent page of movies.
         * Disable sentinel when end of list is reached.
         */
        this.intersectionObserver.createAndObserve(this.sentinel).pipe(
            filter((isVisible: boolean) => isVisible),
            concatMap(() => this.apiManager.fetchMovies()
        )).subscribe(movieList => {
            if (movieList) {
                this.movieList.push(...movieList.content);
            } else {
                this.isSentinelNeeded = false;
            }
        });
    }

    filterByTopRevenue() {
        if (this.isTopRevenueByYearFilterActive) {
            this.isTopRevenueByYearFilterActive = false;
        }

        /* Only request data if filter is previously in inactive state in order to avoid API spam */
        if (!this.isTopRevenueFilterActive) {
            /** 
             * Fetch ALL movies so we can figure out the top 10 in revenue
             * Since we necessarily retrieve all the data with this request, we can hide the sentinel and stop the pagination
             */
            this.apiManager.fetchMovies(false).subscribe(movieList => {
                if (movieList) {
                    this.fallbackMovieList = [...movieList.content];
                    this.movieList = [...this.fallbackMovieList];
                    this.isSentinelNeeded = false;
                    this.movieList = this.apiManager.sortMoviesByRevenue(this.movieList);
                }
            });

            this.isTopRevenueFilterActive = true;
        } 
    }

    filterByYearlyTopRevenue() {
        this.isYearPickerDisplayed = true;

        if (this.isTopRevenueFilterActive) {
            this.isTopRevenueFilterActive = !this.isTopRevenueFilterActive;
        }

        /* Should always be in active state if clicked */
        this.isTopRevenueByYearFilterActive = true;
    }

    onFilterByYearTrigger(year: number) {
        this.apiManager.fetchMoviesByTopYearlyRevenue(year).subscribe(movies => {
            this.movieList = this.apiManager.sortMoviesByRevenue(movies.content);
            this.isYearPickerDisplayed = false;
        })
    }

    resetFilters() {
        this.isTopRevenueFilterActive = false;
        this.isTopRevenueByYearFilterActive = false;
        this.movieList = [...this.fallbackMovieList];

        // if we want to resume pagination, do something like this
        // this.apiManager.currPageNum = 0 <-- encapsulate?
        // this.movieList = []
    }

    isOneFilterActive(): boolean {
        return this.isTopRevenueFilterActive || this.isTopRevenueByYearFilterActive;
    }

    selectMovie(id: string) {
        this.isDetailDisplayed = true;
        this.selectedMovie$ = this.apiManager.fetchMovieById(id);
    }

    onMovieDetailClose() {
        this.isDetailDisplayed = false;
    }

    closeModal() {
        this.resetFilters();
        this.isYearPickerDisplayed = false;
        //this.isDetailDisplayed = false;
    }

    isModalActive(): boolean {
        return this.isDetailDisplayed || this.isYearPickerDisplayed;
    }

    isSentinelActive(): boolean {
        return !this.isOneFilterActive() && this.isSentinelNeeded;
    }

    trackByMovieId(index: number, movie: Movie): string {
        return movie.id;
    }
}