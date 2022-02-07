import { SaveFacebookAccountRepositoryDTO } from '@dtos/contracts/repositories/users/save-facebook-account.dto';

export interface ISaveFacebookAccountRepository {
  saveWithFacebook(params: SaveFacebookAccountRepositoryDTO.Params): SaveFacebookAccountRepositoryDTO.Result;
}
