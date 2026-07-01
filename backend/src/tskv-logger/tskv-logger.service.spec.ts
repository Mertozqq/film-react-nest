import { Test, TestingModule } from '@nestjs/testing';
import { TskvLogger } from './tskv-logger.service';

describe('TskvLoggerService', () => {
  let logger: TskvLogger;
  beforeEach(() => {
    logger = new TskvLogger();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-30T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  })

  it('fromat default message', () => {
    const write = jest.spyOn(process.stdout, 'write')
      .mockImplementation(() => true)
    logger.log('123')
    expect(write).toHaveBeenCalledWith('level=log\tmessage=123\ttimestamp=2026-06-30T12:00:00.000Z\n')
  })

  it('optional parameters check', () => {
    const write = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    logger.log('Создан пользователь', { id: 42 });

    expect(write).toHaveBeenCalledWith(
      'level=log\tmessage=Создан пользователь\tparam0={"id":42}\ttimestamp=2026-06-30T12:00:00.000Z\n',
    );
  });

  it('error level', () => {
    const write = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);

    logger.error('Error 123');

    expect(write).toHaveBeenCalledWith(
      'level=error\tmessage=Error 123\ttimestamp=2026-06-30T12:00:00.000Z\n',
    );
  });
});

