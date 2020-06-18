import { Component, OnInit } from "@angular/core";
import { StopwatchService } from "../services/stopwatch.service";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.scss"],
})
export class StopwatchComponent implements OnInit {
  stopwatchIsStopped: boolean;
  stopwatchIsPaused: boolean;
  isSingleClick: boolean;
  lastClickTime: number;
  timeToDisplay: {
    hours: number;
    minutes: number;
    seconds: number;
  };

  constructor(private stwService: StopwatchService) {}

  ngOnInit(): void {
    this.stopwatchIsStopped = true;
    this.stopwatchIsPaused = false;
    this.lastClickTime = 0;
    this.nullifyTimer();

    this.stwService.time.subscribe((time) => {
      this.timeToDisplay = this.getTimeToDisplay(time);
    });
  }

  startTimer(): void {
    this.stopwatchIsStopped = false;

    if (this.stopwatchIsPaused) this.resumeTimer();
    else this.stwService.startTimer();
  }

  stopTimer(): void {
    this.stopwatchIsStopped = true;

    this.stwService.stopTimer();
    this.nullifyTimer();
  }

  pauseTimer(): void {
    this.stopwatchIsStopped = true;
    this.stopwatchIsPaused = true;

    this.stwService.pauseTimer();
  }

  resumeTimer(): void {
    this.stopwatchIsPaused = false;

    this.stwService.resumeTimer();
  }

  resetTimer(): void {
    this.stopwatchIsPaused = false;
    this.stopwatchIsStopped = false;

    this.stwService.resetTimer();
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

  clickOnWait(): void {
    let secondClickTime = new Date().getTime();

    if (secondClickTime - this.lastClickTime <= 300 && !this.stopwatchIsStopped)
      this.pauseTimer();
    this.lastClickTime = secondClickTime;
  }

  toTwoDigit(num: number): string {
    return num.toLocaleString("en-US", { minimumIntegerDigits: 2 });
  }
}
