import { Controller } from "../../presentation/protocols/controller"
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http"
import { LogControllerDecorator } from "./log-decorator"


class ControllerStub implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: "teste",
      },
    };
    return new Promise((resolve) => resolve(httpResponse));
  }
}

type SutTypes = {
  controllerStub: Controller,
  sut: LogControllerDecorator
}
const makeSut = (): SutTypes => {

  const controllerStub = makeStub()
  const sut = new LogControllerDecorator(controllerStub)
  return {
    controllerStub,
    sut
  }
}
const makeHttpRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "mail@mail.com",
    password: "1234",
    passwordConfirmation: "1234",
  },
});

const makeStub = (): Controller => {
  const stub = new ControllerStub()
  return stub
}
describe("LogControllerDecorator", () => {
  test("Should call controller handle", async () => {
    
    const { sut, controllerStub} = makeSut()
    const handleSpy = jest.spyOn(controllerStub, "handle")
    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "mail@mail.com",
        password: "1234",
        passwordConfirmation: "1234"
      }
      
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toBeCalledTimes(1)
    expect(handleSpy).toBeCalledWith(httpRequest)
  })
  test("Should return the same response of controller", async () => {
    const { sut} = makeSut();
    const httpRequest: HttpRequest = {
      body: {
        name: "teste",
        email: "mail@mail.com",
        password: "1234",
        passwordConfirmation: "1234",
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: "teste"
      }
    })
  });
})