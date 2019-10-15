import { Generators, Website } from '../src';

const assets = [
  new Generators.Assets.CSS({
    size: 100,
  }),
  new Generators.Assets.JS({
    size: 500,
  }),
];

const blog = new Generators.Articles(
  {
    prefix: '/blog',
    limit: 100,
  },
  {
    assets,
  }
);

const homepage = new Generators.Homepage(
  {
    listing: true,
  },
  {
    assets,
  }
);

const website = new Website({
  homepage,
  paths: [
    blog,
    new Generators.HttpStatus({
      prefix: '/http',
    }),
    new Generators.Sitemap('sitemap.xml', []),
    new Generators.Sitemap('blog.xml', [blog]),
  ],
  logger: console,
});

website.start();
console.log('started');
