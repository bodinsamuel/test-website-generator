import Koa from 'koa';
import json from 'koa-json';
import Router from 'koa-router';

import { Server } from 'net';

interface Config {
  homepage: any;
  childs: any;
  sitemaps: any;
  logger: any;
}

export class Website {
  private config: Config;

  private app: Koa;

  private server?: Server;

  constructor(config: Config) {
    this.config = config;
    this.app = new Koa();
  }

  async registers(): Promise<Router> {
    const config = this.config;
    const mainRouter = new Router();
    await Promise.all(
      Object.keys(config.childs).map(async path => {
        const child = config.childs[path];
        const router = await child.register(new Router());
        mainRouter.use(path, router.routes());
      })
    );
    mainRouter.get('/prout', () => {
      console.log('yoo');
    });
    return mainRouter;
  }

  async start(): Promise<void> {
    this.app.use(json());
    this.app.use((ctx, next) => {
      console.log('Serving', ctx.path);
      next();
    });

    const router = await this.registers();
    this.app.use(router.routes()).use(router.allowedMethods());
    console.log(router.stack);

    this.server = this.app.listen(3000);
  }

  stop(): void {
    this.server!.close();
    delete this.app;
    delete this.server;
    delete this.config;
  }
}
