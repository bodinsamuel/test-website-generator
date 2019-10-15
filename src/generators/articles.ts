import { Context } from 'koa';
import Router = require('koa-router');

import { GeneratorInterface } from './generator';
import { HTML, Args as HTMLArgs } from './content/html';

export interface Args {
  prefix: string;
  listing: boolean;
  slug: (slug: string, id: number) => string;
  limit: number;
}

export class Articles extends HTML implements GeneratorInterface {
  public paths: Set<string> = new Set();

  public prefix: string;

  private listing: Args['listing'];

  private slug: Args['slug'];

  private limit: Args['limit'];

  constructor(
    { prefix, listing, slug, limit }: Partial<Args>,
    html?: HTMLArgs
  ) {
    super(html || {});

    this.prefix = prefix || '';
    this.listing = listing || true;
    this.slug = slug || ((slug, id) => `${slug}-${id}.html`);
    this.limit = limit || 100;
  }

  register(router: Router) {
    router.prefix(this.prefix);

    // @ts-ignore
    const match = this.slug(':slug', ':id');

    for (let index = 0; index < this.limit; index++) {
      this.paths.add(`${this.prefix}/${this.slug('a', index)}`);
    }

    this.generateAssets();
    this.registerAssets(router);

    if (this.listing) {
      router.get(`/`, ctx => {
        ctx.status = 200;
        ctx.body = this.generateListing();
      });
    }

    router.get(`/${match}`, ctx => {
      if (!this.paths.has(ctx.path)) {
        return;
      }

      ctx.status = 200;
      ctx.body = this.generatePage(ctx);
    });

    return router;
  }

  generateListing() {
    return this.template({
      title: 'Articles',
      body: `<ul>${Array.from(this.paths)
        .map(path => `<li><a href="${path}">${path}</a></li>`)
        .join('')}</ul>`,
      meta: this.assets.map(asset => asset.meta).join(''),
    });
  }

  generatePage(ctx: Context) {
    return this.template({
      title: ctx.path,
      body: ctx.path,
      meta: this.assets.map(asset => asset.meta).join(''),
    });
  }
}
