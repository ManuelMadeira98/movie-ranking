import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-year-picker',
    templateUrl: './year-picker.component.html',
    styleUrls: ['./year-picker.component.scss']
})
export class YearPickerComponent implements OnInit {
    @Input() isYearPickerDisplayed = false;
    @Output() onYearPickerClose = new EventEmitter();
    @Output() onYearChosen = new EventEmitter<number>();

    years: number[] = [];
    currentYear!: number;

    ngOnInit(): void {
        this.currentYear = new Date().getFullYear();
        this.generateYears();
    }

    selectYear(year: number)  {
        this.onYearPickerClose.emit();
        this.onYearChosen.emit(year);
    }

    private generateYears() {
        let years = [];
        let startYear = this.currentYear - 14;  

        while ( startYear <= this.currentYear ) {
            years.push(startYear++);
        }
        
        this.years = years.reverse();
    }
}
