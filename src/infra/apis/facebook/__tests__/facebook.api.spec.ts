import { mock, MockProxy } from 'jest-mock-extended';

import { ILoadFacebookUserApi } from '@domain/contracts/api/facebook/load-facebook-user.repository';
import { IHttpGetClient } from '@domain/contracts/providers/http-client/http-get-client.provider';

import { right } from '@shared/utils/either';

import { FacebookApi } from '../facebook.api';

describe('Facebook Api', () => {
  let clientId: string;
  let clientSecret: string;
  let httpClient: MockProxy<IHttpGetClient>;
  let sut: ILoadFacebookUserApi;

  beforeAll(() => {
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
    httpClient = mock();
  });

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce(right({ access_token: 'any_app_token' }))
      .mockResolvedValueOnce(right({ data: { user_id: 'any_user_id' } }))
      .mockResolvedValueOnce(
        right({
          id: 'any_facebook_id',
          name: 'any_facebook_name',
          email: 'any_facebook_email',
        }),
      );
    sut = new FacebookApi(httpClient, { clientId, clientSecret });
  });

  it('should get app token', async () => {
    await sut.loadUser({
      token: 'any_client_token',
    });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });

  it('should get debug token', async () => {
    await sut.loadUser({
      token: 'any_client_token',
    });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      },
    });
  });

  it('should get user info', async () => {
    await sut.loadUser({
      token: 'any_client_token',
    });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token',
      },
    });
  });

  it('should return facebook user', async () => {
    const facebookUser = await sut.loadUser({
      token: 'any_client_token',
    });

    expect(facebookUser.value).toEqual({
      facebookId: 'any_facebook_id',
      name: 'any_facebook_name',
      email: 'any_facebook_email',
    });
  });
});
