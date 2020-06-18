import { Injectable } from "@angular/core";
import { Observable, Subject, merge, timer, empty } from "rxjs";
import { startWith, switchMap, scan, takeUntil } from "rxjs/internal/operators";

@Injectable({
  providedIn: "root",
})
export class StopwatchService {
  stopwatch: Observable<number>;
  stop: Subject<void>;
  pause: Subject<boolean>;
  resume: Subject<boolean>;
  time: Subject<number>;

  constructor() {
    this.stop = new Subject<void>();
    this.pause = new Subject<boolean>();
    this.resume = new Subject<boolean>();
    this.time = new Subject<number>();

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

  startTimer(): void {
    this.stopwatch.subscribe((x) => {
      this.time.next(x);
    });
  }

  stopTimer(): void {
    this.stop.next();
  }

  pauseTimer(): void {
    this.pause.next(false);
  }

  resumeTimer(): void {
    this.resume.next(true);
  }

  resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }
}
