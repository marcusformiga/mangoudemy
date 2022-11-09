import bcrypt from "bcryptjs"
import { BcryptAdapter } from "./bcrypt-adapter"

jest.mock("bcryptjs", () => ({
  // mockamos o bcryot nesse caso para nao ter que implementar na mao os detalhes da criptografia da lib
  // nao importa para a gente como eh feita internamente a criptografia.
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("any_value"));
  },
}));
describe("BcryptAdapter", () => {
  // como saber qual metodo vamos mockar ? 
  // instalar a lib e verificar os metodos dentro dela
  
  test("Should call bcrypt with correct data", async () => {
    // passamos o salt via construtor para nao alterar o nosso protocolo por causa do bcrypt
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, "hash")
    await sut.encrypt("any_value")
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt)
  })
  test("Should return a hash on sucess", async () => {
    // como é um caso de sucesso nao precisamos mockar ngm
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt("any_value")
    expect(hash).toBe("any_value")
  });

})