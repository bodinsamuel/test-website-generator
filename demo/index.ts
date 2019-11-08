import { Generators, Website } from '../src';
import algoliaDataset from '../src/datasets/algolia.blog.json';
import { HTML } from '../src/generators/content/html';

const assets = [
  new Generators.Assets.CSS({
    size: 100,
  }),
  new Generators.Assets.JS({
    size: 500,
  }),
];

const htmlBase = new HTML({ assets });
const textGenerator = new Generators.Content.Text(algoliaDataset);

const blog = new Generators.Articles({
  prefix: '/blog',
  limit: 100,
  textGenerator,
  htmlBase: htmlBase,
});

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
    new Generators.RobotsTxt({
      block: '/prout',
      allow: [blog],
    }),
    // new Path('/infinite-loop', [
    //   new Page({
    //     path: '/canonical-source.html'
    //     meta: ['<link rel="canonical" href="canonical-target.html" />']
    //   }),
    //   new Page({
    //     path: '/canonical-target.html'
    //     meta: ['<link rel="canonical" href="canonical-target.html" />']
    //   }),
    // ]),
    // new Static({
    //   serve: __dirname
    // }),
  ],
  logger: console,
});

website.start();
console.log('started');
