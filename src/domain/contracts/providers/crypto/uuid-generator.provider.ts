import { UuidGeneratorDTO } from '@dtos/contracts/providers/crypto/uuid-generator.dto';

export interface IUuidGenerator {
  generateUuid(): UuidGeneratorDTO.Result;
}
