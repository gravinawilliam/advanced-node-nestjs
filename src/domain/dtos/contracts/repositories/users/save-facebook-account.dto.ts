export namespace SaveFacebookAccountRepositoryDTO {
  export type Params = {
    id?: string;
    email: string;
    name: string;
    facebookId: string;
  };

  export type Result = Promise<void>;
}
