import Router = require('koa-router');

import { Asset } from 'generators/assets/asset';
import {
  HTMLTemplateFunction,
  DEFAULT_TEMPLATE,
} from '../../utils/html_template';

export interface Args {
  assets?: Asset[];
  template?: HTMLTemplateFunction;
}

export class HTML {
  protected assets: Asset[];

  public template: HTMLTemplateFunction;

  constructor({ assets = [], template }: Args) {
    this.assets = assets;
    this.template = template || DEFAULT_TEMPLATE;
  }

  generateAssets() {
    if (this.assets.length <= 0) {
      return;
    }

    return this.assets.map(asset => {
      asset.generate();
    });
  }

  registerAssets(router: Router) {
    if (this.assets.length <= 0) {
      return;
    }

    return this.assets.map(asset => {
      router.get(`/${asset.url}`, ctx => {
        ctx.status = 200;
        ctx.type = asset.mime;
        ctx.body = asset.generated;
      });
    });
  }
}
