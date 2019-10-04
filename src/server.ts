import Koa from 'koa';
import json from 'koa-json';

async function bootstrap(): Promise<void> {
  const app = new Koa();

  app.use(json());

  app.listen(3000);
}
bootstrap();
