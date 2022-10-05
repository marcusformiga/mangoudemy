import { DbAddAcount } from "./db-add-account"

describe("DbAddAcount UseCase", () => {
  test("Should call Encrypter with correct password", async () => {

    class EncrypterStub {
      async encrypt(value: string): Promise<string>{
        return new Promise(resolve => resolve("hashed_pass"))
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAcount(encrypterStub)
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
})