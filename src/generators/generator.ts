import Router = require('koa-router');

export abstract class GeneratorInterface {
  abstract register(router: Router): Promise<Router> | Router;
}
