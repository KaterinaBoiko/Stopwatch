import { Component, OnInit } from "@angular/core";
import {
  map,
  switchMap,
  merge,
  takeUntil,
  repeatWhen,
} from "rxjs/internal/operators";
import { Subscription, timer, Subject, pipe, Observable } from "rxjs";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopwatchComponent implements OnInit {
  stopwatch: Observable<number>;
  subscription: Subscription;
  stop: Subject<void>;
  start: Subject<void>;
  reset: Subject<void>;
  timeToDisplay: {
    hours: number;
    minutes: number;
    seconds: number;
  };

  constructor() {}

  ngOnInit(): void {
    this.nullifyTimer();
    this.stop = new Subject<void>();
    this.start = new Subject<void>();
    this.reset = new Subject<void>();

    this.stopwatch = timer(0, 1000).pipe(
      takeUntil(this.stop),
      repeatWhen(() => this.reset)
    );
    console.log(this.stopwatch);

    //this.reset.pipe(switchMap(() => timer(0, 1000))).subscribe;
  }

  startTimer(): void {
    this.subscription = this.stopwatch.subscribe((x) => {
      this.timeToDisplay = this.getTimeToDisplay(x);
    });
    console.log(this.stopwatch);

    //this.start.next();
  }

  stopTimer(): void {
    this.stop.next();
    this.subscription.unsubscribe();
    this.nullifyTimer();
  }

  resetTimer(): void {
    this.reset.next();
    this.nullifyTimer();
  }

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
