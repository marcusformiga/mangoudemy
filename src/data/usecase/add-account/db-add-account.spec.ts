import { AccountModel } from "../../../domain/model/AccountModel";
import { AddAccountModel } from "../../../domain/model/AddAcountModel";
import { AddAcountRepository } from "../../protocols/add-acount-repository";
import { Encrypter } from "../../protocols/Encrypter";
import { DbAddAcount } from "./db-add-account"

const makeSut = (): SutType => {

  
  const encrypterStub = makeEncrypter();
  const addAcountStub = makeAddAcountRepo()
  const sut = new DbAddAcount(encrypterStub, addAcountStub);
  return {
    sut,
    encrypterStub,
    addAcountStub
  }
}

const makeAddAcountRepo = (): AddAcountRepository => {
  class AddAcountRepoStub implements AddAcountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAcc = {
        id: "validid",
        name: "validname",
        email: "validmail@mail.com",
        password: "hashedPass"
      }
      return new Promise(resolve => resolve(fakeAcc))
    }
    
  }
  return new AddAcountRepoStub()
}
const makeEncrypter = (): Encrypter => {

  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_pass"));
    }
  }
  return new EncrypterStub()
}

type SutType = {
  sut: DbAddAcount,
  encrypterStub: Encrypter,
  addAcountStub: AddAcountRepository
}

describe("DbAddAcount UseCase", () => {
  test("Should call Encrypter with correct password", async () => {

    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt")
    const accountData = {
      name: "validname",
      email: "validmail@mai.com",
      password: "validpass",
      passwordConfirmation: "validpass"
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith("validpass")
  })
  test("Should throw if Encrypter throws", async () => {
    const { encrypterStub, sut } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error)))
    const accountData = {
      name: "validname",
      email: "validmail@mai.com",
      password: "validpass",
      passwordConfirmation: "validpass",
    };
    const promise = sut.add(accountData);
    expect(promise).rejects.toThrow()
  });
  test("Should call AddAccountRepository with correct values", async () => {

    const { addAcountStub, sut } = makeSut()
    const addSpy = jest.spyOn(addAcountStub, "add")
    const accountData = {
      name: "validname",
      email: "validmail@mai.com",
      password: "validpass",
      passwordConfirmation: "validpass"
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: "validname",
      email: "validmail@mai.com",
      password: "hashed_pass",
      passwordConfirmation: "validpass",
    });
  })
  test("Should return a account on sucess", async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "validname",
      email: "validmail@mai.com",
      password: "validpass",
      passwordConfirmation: "validpass",
    };
    const account = await sut.add(accountData);
    expect(accountData).toEqual({
      name: "validname",
      email: "validmail@mai.com",
      password: "validpass",
      passwordConfirmation: "validpass",
    });
    
  });
})