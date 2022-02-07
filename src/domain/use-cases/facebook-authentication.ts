import { FacebookAuthenticationDTO } from '@dtos/use-cases/facebook-authentication.dto';

export interface IFacebookAuthenticationUseCase {
  execute(params: FacebookAuthenticationDTO.Params): Promise<FacebookAuthenticationDTO.Result>;
}
