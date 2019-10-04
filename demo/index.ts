import { Generators, Website } from '../src';

const website = new Website({
  homepage: new Generators.Homepage({
    listAllLinks: true,
  }),
  sitemaps: {
    'sitemap.xml': new Generators.Sitemap(),
  },
  childs: {
    '/blog': new Generators.Articles({
      limit: 100,
    }),
    // '/products': new Generators.Products(),
    // '/errors': new Generators.HttpErrors(),
    // '/protected': new Auth.Basic(),
  },
  logger: console,
});

website.start();
console.log('started');
