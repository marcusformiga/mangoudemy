import { AccessToken, Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashCompare } from "../../protocols/hash-compare";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-repository";

export class DbAuthentication implements Authentication {

  constructor(private readonly loadAccountByEmail: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare) { }
  async auth(authentication: AuthenticationModel): Promise<AccessToken> {
    const account = await this.loadAccountByEmail.load(authentication.email)
    if (!account) {
      return null
    }
    await this.hashCompare.compare(authentication.password, account.password)
  }
  
}