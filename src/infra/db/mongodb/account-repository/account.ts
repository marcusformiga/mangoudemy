import { AddAcountRepository } from "../../../../data/protocols/add-acount-repository";
import { AccountModel } from "../../../../domain/model/AccountModel";
import { AddAccountModel } from "../../../../domain/model/AddAcountModel";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepo implements AddAcountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const result = await accountCollection.insertOne(accountData);
    const account = await accountCollection.findOne({ _id: result.insertedId });
    return MongoHelper.mapper(account);
    
  }
  
}