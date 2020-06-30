import moment = require('moment');

export class Timer {
  private logger;
  private intervalObject;
  private updateFrequencyInMilliseconds: number;
  private startTime: moment.Moment;
  private _endTime: moment.Moment;
  private updateFunction: (Timer) => void;
  private stopFunction: (Timer) => void;
  public constructor(
    logger,
    updateFrequencyInMilliseconds,
    updateFunction,
    stopFunction
  ) {
    this.logger = logger.child({ className: 'Timer' });
    this.updateFrequencyInMilliseconds = updateFrequencyInMilliseconds;
    this.updateFunction = updateFunction;
    this.stopFunction = stopFunction;
  }
  public start(durationInSeconds: number): void {
    this.stop();
    this.startTime = moment();
    this._endTime = this.startTime.add(durationInSeconds, 'seconds');
    this.logger.info(this._endTime);
    this.updateFunction(this);
    this.intervalObject = setInterval(() => {
      this.updateFunction(this);
      if (this._endTime < moment()) {
        this.stop();
      }
    }, this.updateFrequencyInMilliseconds);
  }
  public stop(): void {
    if (!this.isRunning) {
      clearInterval(this.intervalObject);
      this.intervalObject = undefined;
      this.stopFunction(this);
      this._endTime = undefined;
    }
  }
  public get isRunning(): boolean {
    return this._endTime;
  }
  public get elapsedDuration(): string {
    return moment().from(this.startTime);
  }
  public get durationLeft(): string {
    return this._endTime.from(moment());
  }
  public get endTime(): moment.Moment {
    return this._endTime;
  }
}
