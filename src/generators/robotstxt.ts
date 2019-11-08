import Router = require('koa-router');

import { GeneratorInterface } from './generator';

interface Args {
  block?: (string | GeneratorInterface)[] | string;
  allow?: (string | GeneratorInterface)[] | string;
}
export class RobotsTxt implements GeneratorInterface {
  public paths: Set<string> = new Set();
  public prefix: string = '';

  private block: Args['block'];
  private allow: Args['allow'];

  constructor({ block, allow }: Args) {
    this.block = block;
    this.allow = allow;
  }

  pattern() {
    return '/robots.txt';
  }

  register(router: Router) {
    const path = `/robots.txt`;
    this.paths.add(path);

    router.get(path, ctx => {
      ctx.status = 200;
      ctx.body = this.generatePage();
    });

    return router;
  }

  pathsToString(
    prefix: string,
    paths?: (string | GeneratorInterface)[] | string | GeneratorInterface
  ): string | null {
    if (!paths) {
      return null;
    }

    if (typeof paths === 'string') {
      return `${prefix}: ${paths}`;
    }

    if (Array.isArray(paths)) {
      return paths
        .map(item => {
          return this.pathsToString(prefix, item);
        })
        .join('\n');
    }

    return this.pathsToString(prefix, paths.pattern());
    // return Array.from(paths.paths)
    //   .map(path => {
    //     return this.pathsToString(prefix, path);
    //   })
    //   .join('\n');
  }

  generatePage() {
    let allow: string | null = this.pathsToString('Allow', this.allow);
    let block: string | null = this.pathsToString('Disallow', this.block);

    return `
User-agent: *
${allow}
${block}
`;
  }
}
