import * as uuid from 'uuid';

import { IUuidGenerator } from '@domain/contracts/providers/crypto/uuid-generator.provider';

import { UuidGeneratorDTO } from '@dtos/contracts/providers/crypto/uuid-generator.dto';

import { UuidGeneratorError } from '@errors/uuid-generator.error';

import { left, right } from '@shared/utils/either';

export class UuidV4UuidGenerator implements IUuidGenerator {
  public generateUuid(): UuidGeneratorDTO.Result {
    try {
      const id = uuid.v4();
      return right(id);
    } catch (error) {
      return left(new UuidGeneratorError());
    }
  }
}
