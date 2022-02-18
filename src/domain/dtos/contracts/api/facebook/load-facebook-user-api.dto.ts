import { HttpClientRequestError } from '@errors/http-client-request.error';

import { Either } from '@shared/utils/either';

export namespace LoadFacebookUserApiDTO {
  export type Params = {
    token: string;
  };

  export type Result = Promise<
    Either<
      HttpClientRequestError | undefined,
      {
        name: string;
        email: string;
        facebookId: string;
      }
    >
  >;
}
