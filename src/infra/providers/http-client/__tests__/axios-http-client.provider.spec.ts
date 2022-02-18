import axios from 'axios';

import { IHttpGetClient } from '@domain/contracts/providers/http-client/http-get-client.provider';

import { HttpClientRequestError } from '@errors/http-client-request.error';

import { AxiosHttpClient } from '../axios-http-client.provider';

jest.mock('axios');

describe('Axios Http Client', () => {
  let sut: IHttpGetClient;
  let fakeAxios: jest.Mocked<typeof axios>;
  let url: string;
  let params: Record<string, unknown>;

  beforeAll(() => {
    url = 'any_url';
    params = { any_param: 'any_value' };
    fakeAxios = axios as jest.Mocked<typeof axios>;
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data',
    });
  });

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url, params });

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', { params });
      expect(fakeAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should return data on success', async () => {
      const result = await sut.get({ url, params });

      expect(result.value).toEqual('any_data');
    });

    it('should rethrow if get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new HttpClientRequestError());

      const promise = sut.get({ url, params });

      expect((await promise).value).toEqual(new HttpClientRequestError());
    });
  });
});
