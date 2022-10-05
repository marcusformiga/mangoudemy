import { AccountModel } from "../../../domain/model/AccountModel";
import { AddAccountModel } from "../../../domain/model/AddAcountModel";
import { AddAcount } from "../../../domain/usecases/add-account";
import { Encrypter } from "../../protocols/Encrypter";

export class DbAddAcount implements AddAcount{

  constructor(private readonly encrypter: Encrypter) { }
  
  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}