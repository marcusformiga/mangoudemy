import { SignUpController } from "./signup.controller";
import { MissingParamError } from "../errors/missing-param-error";
import { InvalidParamError } from "../errors/invalid-param-error";
import { EmailValidator } from "../protocols/email-validator";
import { ServerError } from "../errors/server-error";
import { AddAccountModel } from "../../domain/model/AddAcountModel";
import { AccountModel } from "../../domain/model/AccountModel";
import { AddAcount } from "../../domain/usecases/add-account";

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAcountStub: AddAcount;
};
class EmailValidatorStub implements EmailValidator {
  isValid(email: string) {
    return true;
  }
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAcountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAcountStub);
  return {
    sut,
    emailValidatorStub,
    addAcountStub,
  };
};
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
      return new Promise(resolve => resolve(fakeAcc));
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
  it("Should return 400 if no name has provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "anymail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  it("Should return 400 if no email has provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  it("Should return 400 if a invalid password  provided", async() => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "anyemail@mail.com",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  it("Should return 400 if password is diff passwordConfirmation", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "anyemail@mail.com",
        password: "validpass",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });
  // devemos espionar o nosso metodo isvalid e nesse caso forçamos ele a
  // devemos mocar nosso teste com o valor para pasar, e no caso de falha fazermos um spy e forçamos a falha

  it("Should return 400 if invalid mail is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "invalidemail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
  it("Should call correctly EmailValidator", () => {
    // teste para garantir que estamos passando o email que recebemos na req de maneira correta

    const { sut, emailValidatorStub } = makeSut();
    const validatorSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "anymail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    sut.handle(httpRequest);
    expect(validatorSpy).toHaveBeenCalledWith("anymail@mail.com");
  });
  it("Should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
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
  it("Should call AddAcount with correct values", () => {
    const { sut, addAcountStub } = makeSut();
    const addSpy = jest.spyOn(addAcountStub, "add");
    const httpRequest = {
      body: {
        name: "any_name",
        email: "mail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "mail@mail.com",
      password: "anypass",
      passwordConfirmation: "anypass",
    });
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
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: "validid",
      name: "validname",
      email: "validmail@mail.com",
      password: "validpass",
      passwordConfirmation: "validpass",
    });
   
  })
});
