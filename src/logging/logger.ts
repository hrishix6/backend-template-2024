import { Token } from 'typedi';
import { createLogger, format, transports } from 'winston';

export const LOGGER_TOKEN = new Token('logger_token');

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.errors({ stack: true }), format.json()),
  exitOnError: false,
  transports: [
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.errors({ stack: true }),
        format.printf(
          ({ level, message, context, timestamp, stack, trace }) => {
            return `(${timestamp}) ${level} [${context}] : ${message} ${
              stack ? stack : ''
            } ${trace ? trace : ''}`;
          }
        )
      ),
    }),
  ],
});
