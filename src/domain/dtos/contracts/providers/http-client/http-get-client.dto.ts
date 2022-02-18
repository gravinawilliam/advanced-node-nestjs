import { HttpClientRequestError } from '@errors/http-client-request.error';

import { Either } from '@shared/utils/either';

export namespace HttpGetClientDTO {
  export type Params = {
    url: string;
    params?: Record<string, unknown>;
  };

  export type Result<T = any> = Promise<Either<HttpClientRequestError, T>>;
}
