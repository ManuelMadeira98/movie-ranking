import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Movie, MovieDetails, MovieList } from '../definitions';

@Injectable({
    providedIn: 'root'
})
export class ApiManager {

    private readonly url = 'http://movie-challenge-api-xpand.azurewebsites.net';
    private currPageNum = 0;

    constructor(private http: HttpClient) { }

    /**
     * Since top 10 movies by revenue requires the fetching of ALL movies
     * We need to first check if the request is to be made with pagination (no filter)
     *  - Go page by page, incrementing the page counter
     *  - Each page contains 10 movies
     *  - When end of movie list is reached, reset counter and return null
     * 
     * Or if the request is to obtain all the movies (filter is applied)
     * 
     * @param pagination Flag to check whether we want to parcel out the requests with pagination
     * @returns Movie collection ordered by rank & misc data
     * 
     */
    fetchMovies(pagination = true): Observable<MovieList | null> {
        let endpoint = this.url + "/api/movies";

        if (pagination) {
            endpoint = this.url + "/api/movies?page=" + this.currPageNum + "&size=10";
        }

        return this.http.get<MovieList>(endpoint).pipe(map(data => {
            if (pagination) {
                if (data.content.length === 0) {
                    this.currPageNum = 0;
                    return null;
                }
                this.currPageNum++;
            }
            return data;
        }));
    }

    /**
     * 
     * @param year Specify year of the movies to request
     * @returns Movie collection of the specified year
     */
	fetchMoviesByTopYearlyRevenue(year: number): Observable<MovieList> {
        const endpoint = this.url + "/api/movies?start=" + year + "&end=" + year;
        return this.http.get<MovieList>(endpoint);
    }

    /**
     * 
     * @param id Specify movie ID
     * @returns Details of the movie with given ID
     */
	fetchMovieById(id: string): Observable<MovieDetails> {
		const endpoint = this.url + "/api/movies/" + id;
        return this.http.get<MovieDetails>(endpoint);
	}

    /**
     * 
     * @param movies Movie collection that needs to be sorted by revenue
     * @returns Top 10 movies of the given collection
     */
    sortMoviesByRevenue(movies: Movie[]): Movie[] {
        return movies.sort((movieA, movieB) => movieB.revenue - movieA.revenue).slice(0, 10);
    }
}
