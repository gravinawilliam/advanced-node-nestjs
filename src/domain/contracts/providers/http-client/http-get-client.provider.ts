import { HttpGetClientDTO } from '@dtos/contracts/providers/http-client/http-get-client.dto';

export interface IHttpGetClient {
  get<T = any>(params: HttpGetClientDTO.Params): HttpGetClientDTO.Result<T>;
}
