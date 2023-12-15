import { ErrorRequestHandler, RequestHandler } from 'express';
import { Service } from 'typedi';
import { BaseController } from './base.controller';
import { AppErrorCode } from './types';

@Service()
export class Middlewares extends BaseController {
  onGlobalError: ErrorRequestHandler = (err, req, res) => {
    console.error(err);
    return this.serverError(res, AppErrorCode.SERVER_FAILURE);
  };

  onNotFound: RequestHandler = (req, res) => {
    return this.notFound(res, AppErrorCode.SERVER_UNSUPPORTED_OPERATION);
  };
}
