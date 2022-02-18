import axios from 'axios';

import { IHttpGetClient } from '@domain/contracts/providers/http-client/http-get-client.provider';

import { HttpGetClientDTO } from '@dtos/contracts/providers/http-client/http-get-client.dto';

import { HttpClientRequestError } from '@errors/http-client-request.error';

import { left, right } from '@shared/utils/either';

export class AxiosHttpClient implements IHttpGetClient {
  async get<T = any>({ url, params }: HttpGetClientDTO.Params): HttpGetClientDTO.Result<T> {
    try {
      const result = await axios.get(url, { params });
      return right(result.data);
    } catch (error) {
      return left(new HttpClientRequestError());
    }
  }
}
