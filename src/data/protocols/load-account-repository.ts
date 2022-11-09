import { AccountModel } from "../../domain/model/AccountModel";

export interface LoadAccountByEmailRepository {
  load(email:string): Promise<AccountModel>
}