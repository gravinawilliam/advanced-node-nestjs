import { AuthenticationError } from '@domain/errors/authentication.error';

import { AccessToken } from '@models/access-token.model';

import { Either } from '@shared/utils/either';

export namespace FacebookAuthenticationDTO {
  export type Params = {
    token: string;
  };

  export type Result = Either<AuthenticationError, AccessToken>;
}
