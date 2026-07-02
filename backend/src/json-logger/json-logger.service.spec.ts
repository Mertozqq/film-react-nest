import { JsonLogger } from './json-logger.service';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-30T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('formats a log message as JSON', () => {
    const write = jest.spyOn(console, 'log').mockImplementation();

    logger.log('User created', { id: 42 });

    expect(write).toHaveBeenCalledTimes(1);
    expect(JSON.parse(write.mock.calls[0][0] as string)).toEqual({
      level: 'log',
      message: 'User created',
      optionalParams: [{ id: 42 }],
      timestamp: '2026-06-30T12:00:00.000Z',
    });
  });

  it('writes errors to console.error', () => {
    const write = jest.spyOn(console, 'error').mockImplementation();

    logger.error('Something went wrong');

    expect(write).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'Something went wrong',
        optionalParams: [],
        timestamp: '2026-06-30T12:00:00.000Z',
      }),
    );
  });

  it.each([
    ['warn', 'warn'],
    ['debug', 'debug'],
    ['log', 'verbose'],
  ] as const)('uses console.%s for the %s level', (method, level) => {
    const write = jest.spyOn(console, method).mockImplementation();

    logger[level]('Test message');

    expect(write).toHaveBeenCalledWith(
      JSON.stringify({
        level,
        message: 'Test message',
        optionalParams: [],
        timestamp: '2026-06-30T12:00:00.000Z',
      }),
    );
  });
});
