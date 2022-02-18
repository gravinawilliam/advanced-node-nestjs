import { mock, MockProxy } from 'jest-mock-extended';
import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';

import { IUuidGenerator } from '@domain/contracts/providers/crypto/uuid-generator.provider';
import { ILoadUserAccountRepository } from '@domain/contracts/repositories/users/load-user-account.repository';
import { ISaveFacebookAccountRepository } from '@domain/contracts/repositories/users/save-facebook-account.repository';

import { UserEntity } from '@infra/databases/typeorm/entities/user.entity';
import { makeFakeDb } from '@infra/databases/typeorm/mocks/connection.mock';
import { UserAccountTypeormRepository } from '@infra/databases/typeorm/repositories/user-account-typeorm.repository';

import { right } from '@shared/utils/either';

describe('User Account Typeorm Repository', () => {
  let sut: ILoadUserAccountRepository & ISaveFacebookAccountRepository;
  let userRepository: Repository<UserEntity>;
  let backup: IBackup;
  let uuidGenerator: MockProxy<IUuidGenerator>;

  beforeAll(async () => {
    uuidGenerator = mock();
    uuidGenerator.generateUuid.mockReturnValue(right('any_id'));
    const db = await makeFakeDb([UserEntity]);
    backup = db.backup();
    userRepository = getRepository(UserEntity);
  });

  afterAll(async () => {
    await getConnection().close();
  });

  beforeEach(() => {
    backup.restore();
    sut = new UserAccountTypeormRepository(uuidGenerator);
  });

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await userRepository.save({ id: 'any_id', email: 'any_existing_email' });

      const account = await sut.load({
        email: 'any_existing_email',
      });

      expect(account.value).toEqual({
        id: 'any_id',
      });
    });

    it('should return an undefined if email does not exists', async () => {
      const account = await sut.load({
        email: 'any_non-existing_email',
      });

      expect(account.value).toBeUndefined();
    });
  });

  describe('saveWithFacebook', () => {
    it('should create an account if id is undefined', async () => {
      const createdAccount = await sut.saveWithFacebook({
        email: 'any_existing_email',
        name: 'any_name',
        facebookId: 'any_facebook_id',
      });

      const user = await userRepository.findOne({ where: { email: 'any_name' } });

      expect(user?.id).not.toBeNull();
      expect(createdAccount.isLeft()).not.toBeTruthy();
    });
  });

  it('should update account if id is defined', async () => {
    const user = await userRepository.save({
      id: 'any_id',
      email: 'any_existing_email',
      name: 'any_name',
      facebookId: 'any_facebook_id',
    });

    await sut.saveWithFacebook({
      id: user.id,
      email: 'new_email',
      name: 'new_name',
      facebookId: 'new_facebook_id',
    });

    const foundUserUpdated = await userRepository.findOne({ where: { id: user.id } });

    expect(foundUserUpdated).toEqual({
      id: user.id,
      email: 'any_existing_email',
      name: 'new_name',
      facebookId: 'new_facebook_id',
    });
  });
});
