export class Asset {
  public generated: string = '';
  public readonly mime: string = 'text';

  protected readonly name: string = '';

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
