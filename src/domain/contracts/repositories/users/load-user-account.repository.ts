import { LoadUserAccountRepositoryDTO } from '@dtos/contracts/repositories/users/load-user-account.dto';

export interface ILoadUserAccountRepository {
  load(params: LoadUserAccountRepositoryDTO.Params): LoadUserAccountRepositoryDTO.Result;
}
