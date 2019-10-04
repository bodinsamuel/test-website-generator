import Router = require('koa-router');
import { Context } from 'koa';

import { Config } from '../website';

export abstract class GeneratorInterface {
  public abstract paths: Set<string> = new Set();

  public abstract prefix: string;

  public abstract config?: Config;

  abstract register(router: Router): Promise<Router> | Router;

  abstract generatePage(ctx: Context): string;

  abstract generateListing?(ctx: Context): string;
}
