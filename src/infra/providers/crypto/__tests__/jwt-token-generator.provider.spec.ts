import jwt from 'jsonwebtoken';

import { ITokenGenerator } from '@domain/contracts/providers/crypto/token-generator.provider';

import { TokenGeneratorError } from '@errors/token-generator.error';

import { JwtTokenGenerator } from '../jwt-token-generator.provider';

jest.mock('jsonwebtoken');

describe('Jwt Token Generator', () => {
  let fakeJwt: jest.Mocked<typeof jwt>;
  let sut: ITokenGenerator;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret');
  });

  it('should call sign correct params', async () => {
    await sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key',
    });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      {
        key: 'any_key',
      },
      'any_secret',
      { expiresIn: 1 },
    );
    expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
  });

  it('should return a token', async () => {
    const token = await sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key',
    });

    expect(token.value).toBe('any_token');
  });

  it('should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new TokenGeneratorError();
    });

    const promise = sut.generateToken({
      expirationInMs: 1000,
      key: 'any_key',
    });

    expect((await promise).value).toEqual(new TokenGeneratorError());
  });
});
