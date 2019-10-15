import Router = require('koa-router');

import { GeneratorInterface } from './generator';
import { Config } from 'website';
import { HTML, Args as HTMLArgs } from './content/html';

interface Args {
  listing: boolean;
}
export class Homepage extends HTML implements GeneratorInterface {
  public paths: Set<string> = new Set();

  public prefix: string = '';

  public config?: Config;

  private listing: boolean;

  constructor({ listing }: Partial<Args>, html?: HTMLArgs) {
    super(html || {});

    this.listing = listing || true;
  }

  register(router: Router) {
    if (this.listing) {
      this.paths.add('/');

      this.generateAssets();
      this.registerAssets(router);

      const page = this.generatePage();

      router.get(`/`, ctx => {
        ctx.status = 200;
        ctx.body = page;
      });
    }

    return router;
  }

  generatePage() {
    const childs = this.config!.paths.map(
      child => `<li><a href="${child.prefix}">${child.prefix}</a></li>`
    ).join('');

    return this.template({
      title: 'Homepage',
      body: `
      <ul>
        ${childs}
      </ul>
      `,
      meta: this.assets.map(asset => asset.meta).join(''),
    });
  }
}
