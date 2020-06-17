import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/internal/operators";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopwatchComponent implements OnInit {
  subsubscription: Subscription;
  timeToDisplay: {
    hours: number;
    minutes: number;
    seconds: number;
  };

  constructor() {}

  ngOnInit(): void {
    this.nullifyTimer();
  }

  startTimer(): void {
    this.subsubscription = interval(1000).subscribe((x) => {
      this.timeToDisplay = this.getTimeToDisplay(x);
    });
  }

  stopTimer(): void {
    this.subsubscription.unsubscribe();
    //this.nullifyTimer();
  }

  resetTimer(): void {}

  nullifyTimer(): void {
    this.timeToDisplay = { hours: 0, minutes: 0, seconds: 0 };
  }

  getTimeToDisplay(t) {
    let hours, minutes, seconds;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;

    return { hours: hours, minutes: minutes, seconds: seconds };
  }
}
