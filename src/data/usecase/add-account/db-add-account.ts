import { AccountModel } from "../../../domain/model/AccountModel";
import { AddAccountModel } from "../../../domain/model/AddAcountModel";
import { AddAcount } from "../../../domain/usecases/add-account";
import { AddAcountRepository } from "../../protocols/add-acount-repository";
import { Encrypter } from "../../protocols/Encrypter";

export class DbAddAcount implements AddAcount{

  constructor(private readonly encrypter: Encrypter, private readonly addAcountRepo: AddAcountRepository) { }
  
  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const userAdd = await this.addAcountRepo.add(Object.assign({}, account, {password: hashedPassword}))
    return new Promise(resolve => resolve(null))
  }
}