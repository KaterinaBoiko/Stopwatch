import { Component, OnInit } from "@angular/core";
import { switchMap, takeUntil, startWith, scan } from "rxjs/internal/operators";
import { timer, Subject, Observable, empty, merge } from "rxjs";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopwatchComponent implements OnInit {
  stopwatch: Observable<number>;
  stop: Subject<void> = new Subject<void>();
  pause: Subject<boolean> = new Subject<boolean>();
  resume: Subject<boolean> = new Subject<boolean>();
  stopwatchIsStopped: boolean;
  stopwatchIsPaused: boolean;
  isSingleClick: boolean;
  timeToDisplay: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  timeOfFirstClick: number = 0;

  constructor() {
    this.stopwatch = merge(
      this.pause.asObservable(),
      this.resume.asObservable()
    ).pipe(
      startWith(true),
      switchMap((resumed) => (resumed ? timer(0, 1000) : empty())),
      scan((acc, curr) => (curr ? ++acc : acc)),
      takeUntil(this.stop)
    );
  }

  ngOnInit(): void {
    this.nullifyTimer();
    this.stopwatchIsStopped = true;
    this.stopwatchIsPaused = false;
  }

  startTimer(): void {
    this.stopwatchIsStopped = false;

    if (this.stopwatchIsPaused) this.resumeTimer();
    else
      this.stopwatch.subscribe((x) => {
        this.timeToDisplay = this.getTimeToDisplay(x);
      });
  }

  stopTimer(): void {
    this.stopwatchIsStopped = true;
    this.stop.next();
    this.nullifyTimer();
  }

  pauseTimer() {
    this.stopwatchIsStopped = true;
    this.stopwatchIsPaused = true;
    this.pause.next(false);
  }

  resumeTimer() {
    this.stopwatchIsPaused = false;
    this.resume.next(true);
  }

  resetTimer(): void {
    this.stopwatchIsPaused = false;
    this.stopTimer();
    this.startTimer();
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

  firstClickOnWait() {
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick === false) this.pauseTimer();
    }, 300);
  }

  secondClickOnWait() {
    this.isSingleClick = false;
  }
}
