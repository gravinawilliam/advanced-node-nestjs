import { UuidGeneratorError } from '@errors/uuid-generator.error';

import { Either } from '@shared/utils/either';

export namespace SaveFacebookAccountRepositoryDTO {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = Promise<
    Either<
      UuidGeneratorError,
      {
        id: string;
      }
    >
  >;
}
