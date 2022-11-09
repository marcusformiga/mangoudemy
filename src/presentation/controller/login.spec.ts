import { AccessToken, Authentication, AuthenticationModel } from "../../domain/usecases/authentication"
import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { badRequest, ok, serverError, unauthorized } from "../helpers/http"
import { Validation } from "../protocols/validation"
import { EmailValidator } from "../protocols/email-validator"
import { HttpRequest, HttpResponse } from "../protocols/http"
import { LoginController } from "./login"

type SutType = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "mail@mail.com",
    password: "1234",
    passwordConfirmation: "1234",
  },
});
const makeAuthentication = (): Authentication => {
  // devemos mockar sempre o sucesso, no caso especifico espionamos.
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<AccessToken> {
      return {
        token: 'anyToken'
      }
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};
const makeSut = (): SutType => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub
  };
}
describe('Login Controller', () => {

  it("Should call Authentication with correct value", async () => {
    // quando queremos saber se foi chamado com o valor esperado, capturamos a resposta do spy
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");
    const httpRequest: HttpRequest = {
      body: {
        email: "anymail@mail.com",
        password: "anypass",
      },
    };
    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith({email: "anymail@mail.com", password:"anypass"});
  });
  it("Should return 401 if invalid credentials are provided", async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest: HttpRequest = {
      body: {
        email: "anymail@mail.com",
        password: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
  it("Should return 200 if credentials are provided ", async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: "anymail@mail.com",
        password: "anypass"
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ token: "anyToken" }));

  })
    it("Should call Validation with correct value", async () => {
      const { sut, validationStub } = makeSut();
      const validateSpy = jest.spyOn(validationStub, "validate");
      await sut.handle(makeHttpRequest());
      expect(validateSpy).toHaveBeenCalledWith(makeHttpRequest().body);
    });
    it("Should returns 400 if Validation returns error", async () => {
      const { sut, validationStub } = makeSut();
      jest
        .spyOn(validationStub, "validate")
        .mockReturnValueOnce(new MissingParamError("anyfield"));
      const httpResponse = await sut.handle(makeHttpRequest());
      expect(httpResponse).toEqual(
        badRequest(new MissingParamError("anyfield"))
      );
    });
})
