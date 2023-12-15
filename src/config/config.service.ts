import {
  ConfigModel,
  EnvironmentVars,
  ConfigModelSchema,
} from './config.model';
import { config as loadConfig } from 'dotenv';
import path from 'path';
import { formatZodErrors } from '../utils';
import { Service } from 'typedi';
import { LogService } from '../logging';

@Service()
export class ConfigService {
  private config: Partial<ConfigModel> = {};

  constructor(private readonly logService: LogService) {}

  load() {
    //load environment variables.
    if (process.env['NODE_ENV'] !== 'production') {
      loadConfig({ path: path.join(process.cwd(), '.env') });
    }

    const _: Record<string, any> = {};
    _.db_host = process.env['DB_HOST'];
    _.db_port = process.env['DB_PORT'];
    _.db_name = process.env['DB_NAME'];
    _.db_user = process.env['DB_USER'];
    _.db_pass = process.env['DB_PASS'];
    _.port = process.env['PORT'];
    _.frontend_origins = process.env['FRONTEND_ORIGINS'];
    _.frontend_methods = process.env['FRONTEND_METHODS'];
    _.cache_enabled = process.env['CACHE_ENABLED'];
    _.cache_host = process.env['CACHE_HOST'];
    _.cache_user = process.env['CACHE_USER'];
    _.cache_pass = process.env['CACHE_PASS'];
    _.cache_port = process.env['CACHE_PORT'];

    const validationCheck = ConfigModelSchema.safeParse(_);

    if (!validationCheck.success) {
      throw new Error(
        `Invalid environement config \n ${JSON.stringify(
          formatZodErrors(validationCheck.error),
          null,
          2
        )}`
      );
    }

    this.logService.info(
      `Successfully loaded and verified environment variables`,
      ConfigService.name
    );

    this.config = validationCheck.data;
  }

  get<T>(key: EnvironmentVars) {
    return this.config[key] as T;
  }
}
