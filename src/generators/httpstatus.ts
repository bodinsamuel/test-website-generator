import { Context } from 'koa';
import Router = require('koa-router');

import { GeneratorInterface } from './generator';
import { HTML, Args as HTMLArgs } from './content/html';

export enum Codes {
  BAD_GATEWAY = 502,
  BAD_REQUEST = 400,
  CONFLICT = 409,
  CREATED = 201,
  FORBIDDEN = 403,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  INSUFFICIENT_STORAGE = 507,
  INTERNAL_SERVER_ERROR = 500,
  LENGTH_REQUIRED = 411,
  LOCKED = 423,
  METHOD_FAILURE = 420,
  METHOD_NOT_ALLOWED = 405,
  MOVED_PERMANENTLY = 301,
  MOVED_TEMPORARILY = 302,
  MULTIPLE_CHOICES = 300,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  NOT_IMPLEMENTED = 501,
  NOT_MODIFIED = 304,
  OK = 200,
  PERMANENT_REDIRECT = 308,
  SEE_OTHER = 303,
  SERVICE_UNAVAILABLE = 503,
  TEMPORARY_REDIRECT = 307,
  TOO_MANY_REQUESTS = 429,
  UNAUTHORIZED = 401,
}

export const CODE_MESSAGES: { [key in Codes]: string } = {
  '200': 'OK',
  '201': 'Created',
  '204': 'No Content',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Moved Temporarily',
  '303': 'See Other',
  '304': 'Not Modified',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '409': 'Conflict',
  '411': 'Length Required',
  '420': 'Method Failure',
  '423': 'Locked',
  '429': 'Too Many Requests',
  '500': 'Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '505': 'HTTP Version Not Supported',
  '507': 'Insufficient Storage',
};

export interface Args {
  prefix: string;
  listing: boolean;
  codes: {
    [key in Codes]: boolean;
  };
}

export class HttpStatus extends HTML implements GeneratorInterface {
  public paths: Set<string> = new Set();

  public prefix: string;

  private codes: { [key in Codes]: boolean };

  private listing: Args['listing'];

  constructor({ prefix, codes, listing }: Partial<Args>, html?: HTMLArgs) {
    super(html || {});

    this.prefix = prefix || '';
    this.listing = listing || true;

    this.codes = {
      [Codes.BAD_GATEWAY]: true,
      [Codes.BAD_REQUEST]: true,
      [Codes.CONFLICT]: true,
      [Codes.CREATED]: true,
      [Codes.FORBIDDEN]: true,
      [Codes.HTTP_VERSION_NOT_SUPPORTED]: true,
      [Codes.INSUFFICIENT_STORAGE]: true,
      [Codes.INTERNAL_SERVER_ERROR]: true,
      [Codes.LENGTH_REQUIRED]: true,
      [Codes.LOCKED]: true,
      [Codes.METHOD_FAILURE]: true,
      [Codes.METHOD_NOT_ALLOWED]: true,
      [Codes.MOVED_PERMANENTLY]: true,
      [Codes.MOVED_TEMPORARILY]: true,
      [Codes.MULTIPLE_CHOICES]: true,
      [Codes.NO_CONTENT]: true,
      [Codes.NOT_FOUND]: true,
      [Codes.NOT_IMPLEMENTED]: true,
      [Codes.NOT_MODIFIED]: true,
      [Codes.OK]: true,
      [Codes.PERMANENT_REDIRECT]: true,
      [Codes.SEE_OTHER]: true,
      [Codes.SERVICE_UNAVAILABLE]: true,
      [Codes.TEMPORARY_REDIRECT]: true,
      [Codes.TOO_MANY_REQUESTS]: true,
      [Codes.UNAUTHORIZED]: true,
      ...codes,
    };
  }

  register(router: Router) {
    router.prefix(this.prefix);

    Object.keys(this.codes).forEach(code => {
      if (!code) {
        return;
      }

      const path = `${this.prefix}/${code}`;
      this.paths.add(path);

      router.get(`/${code}`, (ctx: Context) => {
        this.generateResponse(ctx, parseInt(code));
      });
    });

    if (this.listing) {
      router.get(`/`, ctx => {
        ctx.status = 200;
        ctx.body = this.generateListing();
      });
    }

    return router;
  }

  generateListing() {
    return this.template({
      title: 'HTTP Status',
      body: `<ul>${Array.from(this.paths)
        .map(path => `<li><a href="${path}">${path}</a></li>`)
        .join('')}</ul>`,
    });
  }

  generateResponse(ctx: Context, code: Codes) {
    ctx.status = code;

    if (code !== Codes.NO_CONTENT && code !== Codes.NOT_MODIFIED) {
      ctx.body = CODE_MESSAGES[code];
    }

    if (code === Codes.MOVED_PERMANENTLY) {
      ctx.set('Location', '/');
    } else if (code === Codes.MOVED_TEMPORARILY) {
      ctx.set('Location', '/');
    } else if (code === Codes.SEE_OTHER) {
      ctx.set('Location', '/');
    } else if (code === Codes.TEMPORARY_REDIRECT) {
      ctx.set('Location', '/');
    } else if (code === Codes.PERMANENT_REDIRECT) {
      ctx.set('Location', '/');
    }
  }

  generatePage() {
    return '';
  }
}
