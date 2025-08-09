import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-circle-percent',
  imports: [],
  templateUrl: './circle-percent.component.html',
  styleUrl: './circle-percent.component.css'
})
export class CirclePercentComponent implements OnChanges{
  @Input() percent = 50;

  radius = 60;
  circumference = 2 * Math.PI * this.radius;
  strokeDashoffset = this.circumference;

  ngOnChanges() {
    this.setProgress(this.percent);
  }

  setProgress(percent: number) {
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.strokeDashoffset = offset;
  }
}
