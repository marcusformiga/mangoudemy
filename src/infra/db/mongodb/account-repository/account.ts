import { AddAcountRepository } from "../../../../data/protocols/add-acount-repository";
import { AccountModel } from "../../../../domain/model/AccountModel";
import { AddAccountModel } from "../../../../domain/model/AddAcountModel";
import { MongoHelper } from "../helpers/mongo-helper";


export class AccountMongoRepo implements AddAcountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts")
    const result = await accountCollection.insertOne(accountData)
    const account = result.ops[0]
    const {_id, accountWithOutId} = account
    return Object.assign({}, accountWithOutId, {id: _id})
  }
  
}