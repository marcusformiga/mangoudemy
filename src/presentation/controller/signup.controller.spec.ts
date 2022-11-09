import { SignUpController } from "./signup.controller";
import { MissingParamError } from "../errors/missing-param-error";
import { InvalidParamError } from "../errors/invalid-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { ServerError } from "../errors/server-error";
import { AddAccountModel } from "../../domain/model/AddAcountModel";
import { AccountModel } from "../../domain/model/AccountModel";
import { AddAcount } from "../../domain/usecases/add-account";
import { HttpRequest } from "../protocols/http";
import { Validation } from "../protocols/validation";
import { badRequest } from "../helpers/http";
// criar funccoes fabricas para tirar codigo duplicado e usar helpers

type SutTypes = {
  sut: SignUpController;
  addAcountStub: AddAcount;
  validationStub: Validation
};
class EmailValidatorStub implements EmailValidator {
  isValid(email: string) {
    return true;
  }
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAcountStub = makeAddAccount();
  const validationStub = makeValidation()
  const sut = new SignUpController(addAcountStub, validationStub);
  return {
    sut,
    addAcountStub,
    validationStub,
  };
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "mail@mail.com",
    password: "1234",
    passwordConfirmation: "1234",
  },
});
const makeAddAccount = (): AddAcount => {
  class AddAcountStub implements AddAcount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAcc = {
        id: "validid",
        name: "validname",
        email: "validmail@mail.com",
        password: "validpass",
        passwordConfirmation: "validpass",
      };
      return new Promise((resolve) => resolve(fakeAcc));
    }
  }
  return new AddAcountStub();
};
// poderiamos mockar usando jest
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string) {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeEmailValidatorErr = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error();
    }
  }
  return new EmailValidatorStub();
};

describe("SignUpController", () => {

  it("Should call AddAcount with correct values", () => {
    const { sut, addAcountStub } = makeSut();
    const addSpy = jest.spyOn(addAcountStub, "add");
    const httpRequest = makeHttpRequest();
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(makeHttpRequest().body);
  });
  it("Should return 500 if AddAcount throws", async () => {
    const { sut, addAcountStub } = makeSut();
    jest.spyOn(addAcountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalidmail@mail",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  it("Should return 200 when data is provided correctly", async () => {
    const { sut, addAcountStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "validid",
      name: "validname",
      email: "validmail@mail.com",
      password: "validpass",
      passwordConfirmation: "validpass",
    });
  });
  it("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate")
    await sut.handle(makeHttpRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeHttpRequest().body)
  });
  it("Should returns 400 if Validation returns error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("anyfield"))
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("anyfield")))
  });
});
