import express, { NextFunction, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import Container, { Service } from 'typedi';
import { ConfigService } from '../config';
import { Middlewares } from './middlewares';
import { LogService } from '../logging';
import { OpenAPIController } from '../openapi/openapi.controller';

@Service()
export class App {
  constructor(
    private readonly configService: ConfigService,
    private readonly middlewares: Middlewares,
    private readonly logService: LogService,
    private readonly openApiController: OpenAPIController
  ) {}

  setup() {
    const app = express();
    app.disable('x-powered-by');

    app.use(
      morgan(function (tokens, req, res) {
        return [
          `(${new Date().toISOString()})`,
          'info',
          '[incoming] : ',
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens['response-time'](req, res),
          'ms',
        ].join(' ');
      })
    );

    const corsOptions: CorsOptions = {
      origin: this.configService.get<string | string[] | '*'>(
        'frontend_origins'
      ),
      optionsSuccessStatus: 200,
      methods: this.configService.get<string[]>('frontend_methods'),
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    };

    this.logService.info(
      `CORS settings - ${JSON.stringify(corsOptions)}`,
      'app'
    );

    app.use(cors(corsOptions));
    app.use(express.json());

    app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
      if (err instanceof SyntaxError) {
        console.error(err);
        return res.status(400).json({ success: false, error: 'Invalid json' });
      }
      next();
    });

    // Add Controllers here////////////////////////////
    app.get('/api/ping', (req, res) => {
      return res.status(200).json({
        status: 'ok',
        mode: process.env.NODE_ENV == 'production' ? 'prod' : 'dev',
      });
    });

    app.use('/docs', this.openApiController.routes());

    //////////////////////////////////////////////////

    app.use('*', this.middlewares.onNotFound.bind(this.middlewares));
    app.use(this.middlewares.onGlobalError.bind(this.middlewares));

    return app;
  }
}
