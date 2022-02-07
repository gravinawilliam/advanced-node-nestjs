import { ILoadFacebookUserApi } from '@domain/contracts/api/facebook/load-facebook-user.repository';
import { ILoadUserAccountRepository } from '@domain/contracts/repositories/users/load-user-account.repository';
import { ISaveFacebookAccountRepository } from '@domain/contracts/repositories/users/save-facebook-account.repository';
import { IFacebookAuthenticationUseCase } from '@domain/use-cases/facebook-authentication';

import { FacebookAuthenticationDTO } from '@dtos/use-cases/facebook-authentication.dto';

import { AuthenticationError } from '@errors/authentication.error';

import { FacebookAccount } from '@models/facebook-account.model';

import { left } from '@shared/utils/either';

export class FacebookAuthenticationUseCase implements IFacebookAuthenticationUseCase {
  constructor(
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
  ) {}

  public async execute(params: FacebookAuthenticationDTO.Params): Promise<FacebookAuthenticationDTO.Result> {
    const facebookData = await this.facebookApi.loadUser(params);
    if (facebookData.isRight()) {
      const accountData = await this.userAccountRepository.load({ email: facebookData.value.email });
      const facebookAccount = new FacebookAccount(facebookData.value, accountData.value);
      await this.userAccountRepository.saveWithFacebook(facebookAccount);
    }
    return left(new AuthenticationError());
  }
}
