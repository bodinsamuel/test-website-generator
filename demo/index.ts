import { Generators, Website } from '../src';

const blog = new Generators.Articles({
  prefix: '/blog',
  limit: 100,
});

const website = new Website({
  homepage: new Generators.Homepage({
    listing: true,
  }),
  childs: [
    blog,
    // '/products': new Generators.Products(),
    new Generators.HttpStatus({
      prefix: '/http',
    }),
    // '/protected': new Auth.Basic(),
  ],
  sitemaps: [
    new Generators.Sitemap('sitemap.xml', []),
    new Generators.Sitemap('blog.xml', [blog]),
  ],
  logger: console,
});

website.start();
console.log('started');
