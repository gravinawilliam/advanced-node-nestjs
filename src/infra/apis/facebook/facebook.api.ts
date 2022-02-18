import { ILoadFacebookUserApi } from '@domain/contracts/api/facebook/load-facebook-user.repository';
import { IHttpGetClient } from '@domain/contracts/providers/http-client/http-get-client.provider';

import { LoadFacebookUserApiDTO } from '@dtos/contracts/api/facebook/load-facebook-user-api.dto';

import { HttpClientRequestError } from '@errors/http-client-request.error';

import { Either, left, right } from '@shared/utils/either';

type AppToken = {
  // eslint-disable-next-line camelcase
  access_token: string;
};

type DebugToken = {
  data: {
    // eslint-disable-next-line camelcase
    user_id: string;
  };
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
};

type CredentialsFacebookApi = {
  clientId: string;
  clientSecret: string;
};

export class FacebookApi implements ILoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com';

  constructor(private readonly httpClient: IHttpGetClient, private readonly credentials: CredentialsFacebookApi) {}

  async loadUser(params: LoadFacebookUserApiDTO.Params): LoadFacebookUserApiDTO.Result {
    const userInfo = await this.getUserInfo(params.token);
    if (userInfo.isLeft()) return left(userInfo.value);

    return right({
      facebookId: userInfo.value.id,
      name: userInfo.value.name,
      email: userInfo.value.email,
    });
  }

  private async getAppToken(): Promise<Either<HttpClientRequestError, AppToken>> {
    return await this.httpClient.get<AppToken>({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        grant_type: 'client_credentials',
      },
    });
  }

  private async getDebugToken(clientToken: string): Promise<Either<HttpClientRequestError, DebugToken>> {
    const appToken = await this.getAppToken();
    if (appToken.isLeft()) return left(appToken.value);

    return await this.httpClient.get<DebugToken>({
      url: `${this.baseUrl}/debug_token`,
      params: {
        access_token: appToken.value.access_token,
        input_token: clientToken,
      },
    });
  }

  private async getUserInfo(clientToken: string): Promise<Either<HttpClientRequestError, UserInfo>> {
    const debugToken = await this.getDebugToken(clientToken);
    if (debugToken.isLeft()) return left(debugToken.value);

    return await this.httpClient.get<UserInfo>({
      url: `${this.baseUrl}/${debugToken.value.data.user_id}`,
      params: {
        fields: ['id', 'name', 'email'].join(','),
        access_token: clientToken,
      },
    });
  }
}
