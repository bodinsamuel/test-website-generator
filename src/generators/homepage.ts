import Router = require('koa-router');

import { GeneratorInterface } from './generator';
import { HTMLTemplateFunction, DEFAULT_TEMPLATE } from '../utils/html_template';
import { Config } from 'website';

interface Args {
  listing: boolean;
}
export class Homepage implements GeneratorInterface {
  public paths: Set<string> = new Set();

  public prefix: string = '';

  public config?: Config;

  private listing: boolean;

  private template: HTMLTemplateFunction;

  constructor({ listing }: Partial<Args>, template?: HTMLTemplateFunction) {
    this.listing = listing || true;
    this.template = template || DEFAULT_TEMPLATE;
  }

  register(router: Router) {
    if (this.listing) {
      this.paths.add('/');

      router.get(`/`, ctx => {
        ctx.status = 200;
        ctx.body = this.generatePage();
      });
    }

    return router;
  }

  generatePage() {
    const childs = this.config!.childs.map(
      child => `<li><a href="${child.prefix}">${child.prefix}</a></li>`
    ).join('');

    const sitemaps = this.config!.sitemaps!.map(
      child => `<li><a href="${child.prefix}">${child.prefix}</a></li>`
    ).join('');

    return this.template({
      title: 'Homepage',
      body: `
      <ul>
        ${childs}
      </ul>
      <ul>
        ${sitemaps}
      </ul>
      `,
    });
  }
}
