import Router = require('koa-router');
import { Context } from 'koa';

import { Config } from '../website';
import { HTMLTemplateFunction } from 'utils/html_template';

export abstract class GeneratorInterface {
  public abstract paths: Set<string> = new Set();
  public abstract prefix: string;
  public abstract config?: Config;
  public abstract template?: HTMLTemplateFunction;

  abstract pattern(): string;

  abstract register(router: Router): Promise<Router> | Router;

  abstract generatePage(ctx: Context): string;

  abstract generateListing?(ctx: Context): string;
}
