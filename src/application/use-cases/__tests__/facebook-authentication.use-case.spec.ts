import { mocked } from 'jest-mock';
import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookAuthenticationUseCase } from '@application/use-cases/facebook-authentication.use-case';

import { ILoadFacebookUserApi } from '@domain/contracts/api/facebook/load-facebook-user.repository';
import { ITokenGenerator } from '@domain/contracts/providers/crypto/token-generator.provider';
import { ILoadUserAccountRepository } from '@domain/contracts/repositories/users/load-user-account.repository';
import { ISaveFacebookAccountRepository } from '@domain/contracts/repositories/users/save-facebook-account.repository';
import { IFacebookAuthenticationUseCase } from '@domain/use-cases/facebook-authentication';

import { AuthenticationError } from '@errors/authentication.error';

import { AccessToken } from '@models/access-token.model';
import { FacebookAccount } from '@models/facebook-account.model';

import { left, right } from '@shared/utils/either';

jest.mock('@models/facebook-account.model');

describe('Facebook Authentication UseCase', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let crypto: MockProxy<ITokenGenerator>;
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>;
  let sut: IFacebookAuthenticationUseCase;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue(
      right({
        name: 'any_facebook_name',
        email: 'any_facebook_email',
        facebookId: 'any_facebook_id',
      }),
    );
    userAccountRepository = mock();
    userAccountRepository.load.mockResolvedValue(left(undefined));
    userAccountRepository.saveWithFacebook.mockResolvedValue(
      right({
        id: 'any_account_id',
      }),
    );
    crypto = mock();
    crypto.generateToken.mockResolvedValue(right('any_generated_token'));
  });

  beforeEach(() => {
    sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository, crypto);
  });

  it('should call LoadFacebookApi with correct params', async () => {
    await sut.execute({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('should return AuthenticationError when LoadFacebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(left(undefined));

    const response = (await sut.execute({ token })).value as AuthenticationError;

    expect(response).toEqual(new AuthenticationError());
  });

  it('should call LoadUserAccountRepository when LoadFacebookUser returns data', async () => {
    await sut.execute({ token });

    expect(userAccountRepository.load).toHaveBeenCalledWith({ email: 'any_facebook_email' });
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
  });

  it('should call SaveFacebookAccountRepository with FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
    mocked(FacebookAccount).mockImplementation(facebookAccountStub);

    await sut.execute({ token });

    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('should call TokenGenerator with correct params', async () => {
    await sut.execute({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('should return an AccessToken on success', async () => {
    const authResult = await sut.execute({ token });

    expect(authResult.value).toEqual(new AccessToken('any_generated_token'));
  });

  it('should rethrow if ILoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('facebook_error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('facebook_error'));
  });

  it('should rethrow if ILoadUserAccountRepository throws', async () => {
    userAccountRepository.load.mockRejectedValueOnce(new Error('load_error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('load_error'));
  });

  it('should rethrow if ISaveFacebookAccountRepository throws', async () => {
    userAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('save_error'));
  });

  it('should rethrow if ITokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut.execute({ token });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
