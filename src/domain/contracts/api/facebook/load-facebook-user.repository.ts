import { LoadFacebookUserApiDTO } from '@dtos/contracts/api/facebook/load-facebook-user-api.dto';

export interface ILoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApiDTO.Params): LoadFacebookUserApiDTO.Result;
}
