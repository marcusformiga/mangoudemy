import { AddAccountModel } from "../../../../domain/model/AddAcountModel"
import { AccountMongoRepo } from "./account"
import {MongoHelper} from "../helpers/mongo-helper" 

describe("AccountMongoRepo", () => {
  
  // before all -> conecatar no banco
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  })
  // afeter all -> desconectar do banco
  afterAll(async() => {
    await MongoHelper.disconnect();
  })
  // DEVEMOs testar a criacao da conta e o retorno da conta
  test("Should return an account on success", async () => {
    const sut = new AccountMongoRepo()
    const account: AddAccountModel = {
      name: "validName",
      email: "validEmail",
      password: "validPass",
      passwordConfirmation: "validPass"
    }
    const response = await sut.add(account)
    expect(account).toBeTruthy()
    expect(response.name).toBe(account.name)
    expect(response.id).toBeTruthy()
    expect(response.email).toBe(account.email)

  })
})