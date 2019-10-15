import { Asset } from './asset';

interface Args {
  size: number;
}

export class CSS extends Asset {
  private size: number;

  public readonly mime: string = 'text/css';

  constructor({ size }: Args) {
    super();
    this.size = size;
  }

  get url() {
    return `__assets__/${this.name}.css`;
  }

  get meta() {
    return `<link media="all" rel="stylesheet" href="/${this.url}">`;
  }

  generate() {
    if (this.generated !== '') {
      return;
    }

    const str: string = `
      .property { 
        display: block;
        overflow: hidden;
        background-color: inherit;
        box-sizing:border-box;
        color: black;
        font-size: 16px;
      }
    `;

    const iteration = Math.ceil((this.size * 1024) / str.length);
    this.generated = Array(iteration)
      .fill(str)
      .join('');
  }
}
