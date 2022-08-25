export interface Movie {
    id: string;
    title: string;
    year: number;
    rank: number;
    revenue: number;
}

export interface MovieDetails extends Movie {
    genre: string;
    description: string;
    director: string;
    actors: string;
    runtime: number;
    rating: number;
    votes: number;
    metascore: number;
}

export interface Sort {
    unsorted: boolean;
    sorted: false;
    empty: true;
}

export interface MovieList {
    content: Movie[];
    pageable: string;
    size: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    sort: Sort;
}