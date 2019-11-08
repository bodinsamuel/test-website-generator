import Router = require('koa-router');

import { GeneratorInterface } from './generator';

export interface Args {}

export class Sitemap implements GeneratorInterface {
  public paths: Set<string> = new Set();
  public prefix: string = '';

  private generators: GeneratorInterface[];

  constructor(prefix: string, generators: GeneratorInterface[]) {
    this.prefix = prefix;
    this.generators = generators;
  }

  pattern() {
    return `/${this.prefix}`;
  }

  register(router: Router) {
    const path = `/${this.prefix}`;
    this.paths.add(path);

    router.get(path, ctx => {
      ctx.status = 200;
      ctx.type = 'application/xml';
      ctx.body = this.generatePage();
    });

    return router;
  }

  generatePage() {
    const body = this.generators.map(gen =>
      Array.from(gen.paths).map(
        path =>
          `<url><loc>${path}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>`
      )
    );

    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${body}
    </urlset>`;
  }
}
