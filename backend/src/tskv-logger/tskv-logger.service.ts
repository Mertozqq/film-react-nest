import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private stringify(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value === undefined) {
      return 'undefined';
    } else {
      return JSON.stringify(value);
    }
  }
  private escape(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, `\\t`)
      .replace(/\n/g, `\\n`)
      .replace(/\r/g, `\\r`);
  }

  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const params = optionalParams
      .map((val, index) => {
        return `param${index}=${this.escape(this.stringify(val))}`;
      })
      .join('\t');
    return (
      [
        `level=${this.escape(level)}`,
        `message=${this.escape(this.stringify(message))}`,
        params,
        `timestamp=${new Date().toISOString()}`,
      ]
        .filter(Boolean) // если params пустой
        .join('\t') + '\n'
    );
  }
  // используется  process.stdout / stderr тк console.log автоматически переносит на новую строку, получается лишний перенос
  log(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    process.stderr.write(
      this.formatMessage('error', message, ...optionalParams),
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('warn', message, ...optionalParams),
    );
  }

  debug(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('debug', message, ...optionalParams),
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('verbose', message, ...optionalParams),
    );
  }
}
