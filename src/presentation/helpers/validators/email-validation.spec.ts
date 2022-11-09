
// criar funccoes fabricas para tirar codigo duplicado e usar helpers

import { EmailValidator } from "../../protocols/email-validator";
import { EmailValidation } from "./email-validation";

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: EmailValidator;
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
        return true
    }

  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub,
  
  };
};

// poderiamos mockar usando jest

describe("EmailValidation", () => {
  it("Should call correctly EmailValidator", () => {
    // teste para garantir que estamos passando o email que recebemos na req de maneira correta

    const { sut, emailValidatorStub } = makeSut();
    const validatorSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({email: "anymail@mail.com"});
    expect(validatorSpy).toHaveBeenCalledWith("anymail@mail.com");
  });
  it("Should throw if EmailValidator throws", () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    });
    expect(sut.validate).toThrow()

  });
 
});
