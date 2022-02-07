import { Either } from '@shared/utils/either';

export namespace LoadFacebookUserApiDTO {
  export type Params = {
    token: string;
  };

  export type Result = Promise<
    Either<
      undefined,
      {
        name: string;
        email: string;
        facebookId: string;
      }
    >
  >;
}
