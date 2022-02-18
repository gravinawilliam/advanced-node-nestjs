import { TokenGeneratorDTO } from '@dtos/contracts/providers/crypto/token-generator.dto';

export interface ITokenGenerator {
  generateToken(params: TokenGeneratorDTO.Params): TokenGeneratorDTO.Result;
}
