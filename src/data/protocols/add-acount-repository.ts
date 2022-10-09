import { AccountModel } from "../../domain/model/AccountModel";
import { AddAccountModel } from "../../domain/model/AddAcountModel";

export interface AddAcountRepository {
  add(account: AddAccountModel): Promise<AccountModel>;
}