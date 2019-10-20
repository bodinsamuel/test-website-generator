import { Context } from 'koa';
import Router = require('koa-router');

import { GeneratorInterface } from './generator';
import { HTML } from './content/html';
import { Text } from './content/text';
import { ARTICLE_BODY } from '../utils/article_body';

export interface Args {
  prefix: string;
  listing: boolean;
  slug: (slug: string, id: number) => string;
  limit: number;
  textGenerator: Text;
  htmlBase: HTML;
  bodyTemplate: (args: any) => string;
}

export class Articles implements GeneratorInterface {
  public paths: Set<string> = new Set();

  public prefix: string;

  private listing: Args['listing'];

  private slug: Args['slug'];

  private limit: Args['limit'];

  private textGenerator: Args['textGenerator'];

  private htmlBase: HTML;

  private bodyTemplate: Args['bodyTemplate'];

  constructor({
    prefix,
    listing,
    slug,
    limit,
    textGenerator,
    htmlBase,
    bodyTemplate,
  }: Partial<Args>) {
    if (!textGenerator) {
      throw new Error('Missing mandatory `textGenerator`');
    }
    if (!htmlBase) {
      throw new Error('Missing mandatory `htmlBase`');
    }

    this.prefix = prefix || '';
    this.listing = listing || true;
    this.slug = slug || ((slug, id) => `${slug}-${id}.html`);
    this.limit = limit || 100;
    this.bodyTemplate = bodyTemplate || ARTICLE_BODY;
    this.textGenerator = textGenerator;
    this.htmlBase = htmlBase;
  }

  register(router: Router) {
    router.prefix(this.prefix);

    // @ts-ignore
    const match = this.slug(':slug', ':id(\\d+)');

    for (let index = 0; index < this.limit; index++) {
      const slug = this.textGenerator.slugify(
        this.textGenerator.getArticle(index).title
      );
      this.paths.add(`${this.prefix}/${this.slug(slug, index)}`);
    }

    this.htmlBase.generateAssets();
    this.htmlBase.registerAssets(router);

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
    return this.htmlBase.template({
      title: 'Articles',
      body: `<ul>${Array.from(this.paths)
        .map(path => `<li><a href="${path}">${path}</a></li>`)
        .join('')}</ul>`,
      meta: this.htmlBase.assets.map(asset => asset.meta).join(''),
    });
  }

  generatePage(ctx: Context) {
    console.log('prout', ctx.params.id);
    const article = this.textGenerator.getArticle(ctx.params.id);
    return this.htmlBase.template({
      title: ctx.path,
      body: this.bodyTemplate({
        title: article.title,
        author: article.author,
        text: article.text
          .split('\n')
          .map(t => `<p>${t}</p>`)
          .join(''),
      }),
      meta: this.htmlBase.assets.map(asset => asset.meta).join(''),
    });
  }
}
