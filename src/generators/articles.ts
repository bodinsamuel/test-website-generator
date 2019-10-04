import { GeneratorInterface } from './generator';
import Router = require('koa-router');

interface Args {
  slug: (slug: string, id: number) => string;
  limit: number;
}

export class Articles implements GeneratorInterface {
  private slug: Args['slug'];
  private limit: Args['limit'];

  constructor({ slug, limit }: Partial<Args>) {
    this.slug = slug || ((slug, id) => `${slug}-${id}.html`);
    this.limit = limit || 100;
  }

  register(router: Router) {
    const paths: string[] = [];

    // @ts-ignore
    const match = this.slug(':slug', ':id');

    for (let index = 0; index < this.limit; index++) {
      paths.push(this.slug('a', index));
    }

    router.get(`/${match}`, ctx => {
      console.log('hello', ctx.path);

      ctx.status = 200;
      ctx.body = 'prout';
    });

    console.log(paths);
    console.log(match);

    return router;
  }
}
