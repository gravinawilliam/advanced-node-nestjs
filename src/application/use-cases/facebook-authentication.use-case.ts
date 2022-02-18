import { ILoadFacebookUserApi } from '@domain/contracts/api/facebook/load-facebook-user.repository';
import { ITokenGenerator } from '@domain/contracts/providers/crypto/token-generator.provider';
import { ILoadUserAccountRepository } from '@domain/contracts/repositories/users/load-user-account.repository';
import { ISaveFacebookAccountRepository } from '@domain/contracts/repositories/users/save-facebook-account.repository';
import { IFacebookAuthenticationUseCase } from '@domain/use-cases/facebook-authentication';

import { FacebookAuthenticationDTO } from '@dtos/use-cases/facebook-authentication.dto';

import { AuthenticationError } from '@errors/authentication.error';

import { AccessToken } from '@models/access-token.model';
import { FacebookAccount } from '@models/facebook-account.model';

import { left, right } from '@shared/utils/either';

export class FacebookAuthenticationUseCase implements IFacebookAuthenticationUseCase {
  constructor(
    private readonly facebookApi: ILoadFacebookUserApi,
    private readonly userAccountRepository: ILoadUserAccountRepository & ISaveFacebookAccountRepository,
    private readonly crypto: ITokenGenerator,
  ) {}

  public async execute(params: FacebookAuthenticationDTO.Params): Promise<FacebookAuthenticationDTO.Result> {
    const facebookData = await this.facebookApi.loadUser(params);

    if (facebookData.isRight()) {
      const accountData = await this.userAccountRepository.load({
        email: facebookData.value.email,
      });
      const facebookAccount = new FacebookAccount(facebookData.value, accountData.value);
      const saved = await this.userAccountRepository.saveWithFacebook(facebookAccount);
      if (saved.isLeft()) return left(saved.value);
      const token = await this.crypto.generateToken({
        key: saved.value.id,
        expirationInMs: AccessToken.expirationInMs,
      });

      if (token.isRight()) {
        return right(new AccessToken(token.value));
      }
    }

    return left(new AuthenticationError());
  }
}
