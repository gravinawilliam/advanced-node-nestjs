import { TokenGeneratorError } from '@errors/token-generator.error';

import { Either } from '@shared/utils/either';

export namespace TokenGeneratorDTO {
  export type Params = {
    key: string;
    expirationInMs: number;
  };

  export type Result = Promise<Either<TokenGeneratorError, string>>;
}
