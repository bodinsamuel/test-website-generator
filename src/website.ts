import Koa from 'koa';
import json from 'koa-json';
import Router from 'koa-router';

import { Server } from 'net';
import { GeneratorInterface } from './generators/generator';

export interface Config {
  homepage: any;
  childs: GeneratorInterface[];
  sitemaps?: GeneratorInterface[];
  logger?: any;
}

export class Website {
  private config: Config;

  private app: Koa;

  private server?: Server;

  constructor(config: Config) {
    this.config = { logger: console, sitemaps: [], ...config };
    this.app = new Koa();
  }

  async registers(): Promise<Router> {
    const config = this.config;
    const mainRouter = new Router();

    await Promise.all(
      config.childs.map(async child => {
        child.config = config;
        const router = await child.register(new Router());
        mainRouter.use(router.routes());
      })
    );

    if (config.sitemaps) {
      await Promise.all(
        config.sitemaps.map(async sitemap => {
          sitemap.config = config;
          const router = await sitemap.register(new Router());
          mainRouter.use(router.routes());
        })
      );
    }

    if (config.homepage) {
      config.homepage.config = config;
      const router = await config.homepage.register(new Router());
      mainRouter.use(router.routes());
    }

    return mainRouter;
  }

  async start(): Promise<void> {
    this.app.use(json());

    // Logger
    this.app.use((ctx, next) => {
      console.log('Serving', ctx.path);
      next();
    });

    const router = await this.registers();
    this.app.use(router.routes()).use(router.allowedMethods());

    this.server = this.app.listen(3000);
  }

  stop(): void {
    this.server!.close();
    delete this.app;
    delete this.server;
    delete this.config;
  }
}
