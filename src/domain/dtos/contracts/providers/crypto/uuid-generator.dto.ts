import { UuidGeneratorError } from '@errors/uuid-generator.error';

import { Either } from '@shared/utils/either';

export namespace UuidGeneratorDTO {
  export type Result = Either<UuidGeneratorError, string>;
}
