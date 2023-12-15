import { Router } from 'express';
import { Service } from 'typedi';
import swaggerUi from 'swagger-ui-express';
import doc from './spec.json';

@Service()
export class OpenAPIController {
  routes() {
    const router = Router();

    router.use('/', swaggerUi.serve);

    router.get('/', swaggerUi.setup(doc, { explorer: false }));

    return router;
  }
}
