import { Either } from '@shared/utils/either';

export namespace LoadUserAccountRepositoryDTO {
  export type Params = {
    email: string;
  };

  export type Result = Promise<
    Either<
      undefined,
      {
        id: string;
        name?: string;
      }
    >
  >;
}
