import fs = require('fs');
import path = require('path');

export class SharedFile {
  private logger;
  private _text;
  private path;
  public constructor(logger, filepath: string) {
    this.logger = logger.child({ className: 'SharedFile' });
    this.path = path.resolve(filepath);
    try {
      this._text = fs.readFileSync(this.path, 'utf8');
    } catch (err) {
      //do nothing
    }
  }
  public setText(newText: string): void {
    if (this.text !== newText) {
      fs.writeFile(
        this.path,
        newText,
        function (err): void {
          if (err) {
            this.logger.info(err);
            return;
          }
          this._text = newText;
          this.logger.info(`set text to '${this.text}'`);
        }.bind(this)
      );
    }
  }
  public get text(): string {
    return this._text;
  }
}
