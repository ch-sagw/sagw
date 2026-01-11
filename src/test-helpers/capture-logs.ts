export class LogCapture {
  private _logs: string[] = [];
  private _originalLog: typeof console.log | null = null;
  private _isCapturing = false;

  public get logs(): string[] {
    return this._logs;
  }

  public hasLog(message: string): boolean {
    return this._logs.some((log) => log.includes(message));
  }

  public captureLogs(): void {
    if (this._isCapturing) {
      return;
    }

    this._originalLog = console.log;
    this._logs = [];
    this._isCapturing = true;

    console.log = (...args: unknown[]): void => {
      const message = args.map((arg) => (typeof arg === 'string'
        ? arg
        : JSON.stringify(arg)))
        .join(' ');

      this._logs.push(message);
      this._originalLog?.(...args);
    };
  }

  public detachLogs(): void {
    if (!this._isCapturing || !this._originalLog) {
      return;
    }

    console.log = this._originalLog;
    this._originalLog = null;
    this._isCapturing = false;
  }
}
