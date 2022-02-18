import { getRepository, Repository } from 'typeorm';

import { IUuidGenerator } from '@domain/contracts/providers/crypto/uuid-generator.provider';
import { ILoadUserAccountRepository } from '@domain/contracts/repositories/users/load-user-account.repository';
import { ISaveFacebookAccountRepository } from '@domain/contracts/repositories/users/save-facebook-account.repository';

import { LoadUserAccountRepositoryDTO } from '@dtos/contracts/repositories/users/load-user-account.dto';
import { SaveFacebookAccountRepositoryDTO } from '@dtos/contracts/repositories/users/save-facebook-account.dto';

import { left, right } from '@shared/utils/either';

import { UserEntity } from '../entities/user.entity';

export class UserAccountTypeormRepository implements ILoadUserAccountRepository, ISaveFacebookAccountRepository {
  private ormRepository: Repository<UserEntity>;

  constructor(private readonly uuidGenerator: IUuidGenerator) {
    this.ormRepository = getRepository(UserEntity);
  }

  public async load(params: LoadUserAccountRepositoryDTO.Params): LoadUserAccountRepositoryDTO.Result {
    const foundUser = await this.ormRepository.findOne({
      email: params.email,
    });

    if (foundUser === undefined) return left(foundUser);

    return right({
      id: foundUser.id,
      name: foundUser.name ?? undefined,
    });
  }

  public async saveWithFacebook({
    email,
    facebookId,
    name,
    id,
  }: SaveFacebookAccountRepositoryDTO.Params): SaveFacebookAccountRepositoryDTO.Result {
    if (id !== undefined) {
      await this.ormRepository.update(
        {
          id,
        },
        {
          facebookId,
          name,
          id,
        },
      );

      return right({
        id,
      });
    }

    const uuid = this.uuidGenerator.generateUuid();
    if (uuid.isLeft()) return left(uuid.value);
    return right(
      await this.ormRepository.save({
        email,
        facebookId,
        name,
        id: uuid.value,
      }),
    );
  }
}
