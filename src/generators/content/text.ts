import slugify from 'slugify';

export interface Dataset {
  author: string;
  title: string;
  text: string;
}

export class Text {
  private dataset: Dataset[];

  constructor(dataset: Dataset[]) {
    this.dataset = dataset;
  }

  slugify(str: string): string {
    return slugify(str, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }

  getArticle(id: number): Dataset {
    return this.dataset[id];
  }
}
