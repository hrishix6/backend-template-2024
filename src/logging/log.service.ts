import { Inject, Service } from 'typedi';
import { LOGGER_TOKEN } from './logger';
import { Logger } from 'winston';

@Service()
export class LogService {
  @Inject(LOGGER_TOKEN)
  private readonly _logger: Logger;

  info(message: string, context: string) {
    this._logger.log({
      level: 'info',
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  error(message: string, context: string) {
    this._logger.log({
      level: 'error',
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
