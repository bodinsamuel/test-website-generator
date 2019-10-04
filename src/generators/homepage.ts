interface Args {
  listAllLinks: boolean;
}
export class Homepage {
  private listAllLinks: boolean;

  constructor({ listAllLinks = true }: Args) {
    this.listAllLinks = listAllLinks;
  }

  register() {
    if (this.listAllLinks) {
      console.log('plp^');
    }
  }
}
