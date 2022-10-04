import { AccountModel } from "../model/AccountModel";
import { AddAccountModel } from "../model/AddAcountModel";

export interface AddAcount {
  add(account: AddAccountModel): AccountModel
}