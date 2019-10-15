export class Asset {
  public generated: string = '';

  protected readonly name: string = '';

  public readonly mime: string = 'text';

  constructor() {
    this.name = `${Math.random()}`;
  }

  get meta(): string {
    return '';
  }

  get url(): string {
    return '';
  }

  generate(): void {}
}
