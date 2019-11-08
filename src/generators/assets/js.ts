import { Asset } from './asset';

interface Args {
  size: number;
}

export class JS extends Asset {
  public readonly mime: string = 'application/javascript';

  private size: number;

  constructor({ size }: Args) {
    super();
    this.size = size;
  }

  get url() {
    return `__assets__/${this.name}.js`;
  }

  get meta() {
    return `<script  type="application/javascript" src="/${this.url}"></script>`;
  }

  generate() {
    if (this.generated !== '') {
      return;
    }

    const str: string = `
      function def() {
        console.log('hello world');
        math.random();
        const $body = document.querySelector('body');
      }
    `;

    const iteration = Math.ceil((this.size * 1024) / str.length);
    this.generated = Array(iteration)
      .fill(str)
      .join('');
  }
}
