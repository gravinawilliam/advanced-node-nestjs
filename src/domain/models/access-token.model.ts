export class AccessToken {
  constructor(private readonly value: string) {
    // eslint-disable-next-line no-console
    console.log(this.value);
  }

  static get expirationInMs(): number {
    return 30 * 60 * 1000;
  }
}
