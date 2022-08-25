import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class IntersectionObserverService {

    createAndObserve(element: ElementRef): Observable<boolean> {
        /* Return an observable that will emit a boolean event everytime host element is intersected */
        return new Observable((observer) => {
            const intersectionObserver = new IntersectionObserver((entries) => {
                observer.next(entries);
            });
            intersectionObserver.observe(element.nativeElement);
            return () => { 
                intersectionObserver.disconnect(); 
            };
        }).pipe(
            mergeMap((entries) => entries as IntersectionObserverEntry[]),
            map((entry) => entry.isIntersecting),
            distinctUntilChanged()
        );
    }
}