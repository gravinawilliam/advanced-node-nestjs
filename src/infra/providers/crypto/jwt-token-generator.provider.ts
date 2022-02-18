import jwt from 'jsonwebtoken';

import { ITokenGenerator } from '@domain/contracts/providers/crypto/token-generator.provider';

import { TokenGeneratorDTO } from '@dtos/contracts/providers/crypto/token-generator.dto';

import { TokenGeneratorError } from '@errors/token-generator.error';

import { left, right } from '@shared/utils/either';

export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly secret: string) {}

  async generateToken(params: TokenGeneratorDTO.Params): TokenGeneratorDTO.Result {
    const expirationInSeconds = params.expirationInMs / 1000;
    try {
      const token = await jwt.sign(
        {
          key: params.key,
        },
        this.secret,
        {
          expiresIn: expirationInSeconds,
        },
      );
      return right(token);
    } catch (error) {
      return left(new TokenGeneratorError());
    }
  }
}
