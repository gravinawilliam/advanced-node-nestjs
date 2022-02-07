import { mocked } from 'jest-mock';
import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookAuthenticationUseCase } from '@application/use-cases/facebook-authentication.use-case';

import { ILoadFacebookUserApi } from '@domain/contracts/api/facebook/load-facebook-user.repository';
import { ILoadUserAccountRepository } from '@domain/contracts/repositories/users/load-user-account.repository';
import { ISaveFacebookAccountRepository } from '@domain/contracts/repositories/users/save-facebook-account.repository';
import { IFacebookAuthenticationUseCase } from '@domain/use-cases/facebook-authentication';

import { AuthenticationError } from '@errors/authentication.error';

import { FacebookAccount } from '@models/facebook-account.model';

import { left, right } from '@shared/utils/either';

jest.mock('@models/facebook-account.model');
describe('Facebook Authentication UseCase', () => {
  let facebookApi: MockProxy<ILoadFacebookUserApi>;
  let userAccountRepository: MockProxy<ILoadUserAccountRepository & ISaveFacebookAccountRepository>;
  let sut: IFacebookAuthenticationUseCase;
  const token = 'any_token';

  beforeEach(() => {
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
    sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository);
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
});
