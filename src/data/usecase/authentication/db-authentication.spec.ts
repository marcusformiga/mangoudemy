import { AccountModel } from "../../../domain/model/AccountModel";
import {
  AccessToken,
  Authentication,
  AuthenticationModel,
} from "../../../domain/usecases/authentication";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-repository";
import { DbAuthentication } from "./db-authentication";
import {HashCompare} from "../../protocols/hash-compare"

const makeFakeAccount = (): AccountModel => ({
  id: "validId",
  name: "validName",
  email: "validEmail",
  password: "hashedPassword",
});

const makeFakeAuth = (): AuthenticationModel => ({
  email: "anymail@mail.com",
  password: "rawPassword"

})
const makeLoadAccount = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository {
    async load(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
}

const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare(value: string, hashedValue: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
    
  }
  return new HashCompareStub();
};
type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailStub: LoadAccountByEmailRepository;
  hashCompareStub: HashCompare
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailStub = makeLoadAccount();
  const hashCompareStub = makeHashCompareStub()
  const sut = new DbAuthentication(loadAccountByEmailStub, hashCompareStub);
  return {
    sut,
    loadAccountByEmailStub,
    hashCompareStub
  }
}
describe("DBAuthentication UseCase", () => {
  // estamos testando a integração entre componentes, por isso nao precisamos validar o retorno
  // precisamos de um authStub
  it("Should call LoadAccountByEmail with correct values", async () => {
    const {sut, loadAccountByEmailStub} = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailStub, "load");
    await sut.auth(makeFakeAuth())
    expect(loadSpy).toHaveBeenCalledWith("anymail@mail.com");
  });
  it("Should throws if LoadAccountByEmail throws", async () => {
     // mocamos o erro e capturamos 
    // capturamos a promise pq o jest nao lida bem de maneira async
     const { sut, loadAccountByEmailStub } = makeSut();
     jest.spyOn(loadAccountByEmailStub, "load").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
     const promise = sut.auth({email: "anymail@mail.com", password: "invalid"})
     await expect(promise).rejects.toThrow()
   });
   it("Should return null if LoadAccountRepo returns null", async () => {
     const { sut, loadAccountByEmailStub } = makeSut();
     const token = jest.spyOn(loadAccountByEmailStub, "load").mockReturnValueOnce(null)
     await sut.auth(makeFakeAuth())
     expect(token).toBeNull()
   });
  it("Should call HashCompare to compare password", async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, "compare");
    await sut.auth(makeFakeAuth());
    expect(compareSpy).toHaveBeenCalledWith("rawPassword", "hashedPassword");
  });

});
