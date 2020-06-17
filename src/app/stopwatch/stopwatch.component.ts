import { Component, OnInit } from "@angular/core";
import {
  switchMap,
  takeUntil,
  startWith,
  mapTo,
  shareReplay,
  concatMap,
  filter,
  take,
  scan,
  withLatestFrom,
  map,
} from "rxjs/internal/operators";
import {
  timer,
  Subject,
  Observable,
  empty,
  EMPTY,
  merge,
  fromEvent,
  of,
  BehaviorSubject,
} from "rxjs";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopwatchComponent implements OnInit {
  stopwatch: Observable<number>;
  stop: Subject<void> = new Subject();
  paused: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  stopwatchIsStopped: boolean;
  stopwatchIsPaused: boolean;
  timeToDisplay: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  stopClick$ = new Subject();
  pause = new Subject();
  resume = new Subject();

  constructor() {
    this.stopwatch = merge(
      this.pause.asObservable(),
      this.resume.asObservable()
    ).pipe(
      startWith(true),
      switchMap((val) => (val ? timer(0, 1000) : empty())),
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

    if (!this.stopwatchIsPaused)
      this.stopwatch.subscribe((x) => {
        this.timeToDisplay = this.getTimeToDisplay(x);
      });
    else this.resumeTimer();
  }

  stopTimer(): void {
    this.stop.next();
    this.stopwatchIsStopped = true;
    this.nullifyTimer();
  }

  pauseTimer() {
    this.pause.next(false);
    this.stopwatchIsStopped = true;
    this.stopwatchIsPaused = true;
  }

  resumeTimer() {
    this.resume.next(true);
    this.stopwatchIsPaused = false;
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
}
