import { AddAccountModel } from "../../../../domain/model/AddAcountModel"
import { AccountMongoRepo } from "./account"
import {MongoHelper} from "../helpers/mongo-helper" 


const makeSut = (): AccountMongoRepo => {
  return new AccountMongoRepo()
}
describe("AccountMongoRepo", () => {
  
  // before all -> conecatar no banco
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  })
  // afeter all -> desconectar do banco
  afterAll(async() => {
    await MongoHelper.disconnect();
  })
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts")
    await accountCollection.deleteMany({})
  })
  // DEVEMOs testar a criacao da conta e o retorno da conta
  test("Should return an account on success", async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'anyName',
      email: 'anymail@mail.com',
      password: 'anyPass',
      passwordConfirmation: 'anyPass'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy();
    // expect(account.name).toBe('anyName')

  })
})