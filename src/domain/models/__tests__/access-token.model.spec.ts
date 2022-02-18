import { AccessToken } from '@models/access-token.model';

describe('Access Token', () => {
  it('should create with a value', () => {
    const sut = new AccessToken('any_value');

    expect(sut).toEqual({ value: 'any_value' });
  });

  it('should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000);
  });
});
