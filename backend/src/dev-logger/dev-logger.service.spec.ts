import { ConsoleLogger } from '@nestjs/common';
import { DevLogger } from './dev-logger.service';

describe('DevLogger', () => {
  it('extends the Nest ConsoleLogger', () => {
    const logger = new DevLogger();

    expect(logger).toBeInstanceOf(ConsoleLogger);
  });
});
