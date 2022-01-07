import { SignUpController } from "./signup.controller"
import {MissingParamError} from '../errors/missing-param-error'
import { InvalidParamError } from "../errors/invalid-param-error"
import { EmailValidator } from "../protocols/email-validator"

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes =>{
  class EmailValidatorStub implements EmailValidator  {
    isValid(email: string){
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe("SignUpController", () =>{
  it("Should return 400 if no name has provided", () =>{
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        email: "anymail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass"
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("name"))
  })
  it("Should return 400 if no email has provided", () =>{
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass"
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("email"))
  })
  it("Should return 400 if a invalid password  provided", () =>{
    const {sut} = makeSut()
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "anyemail@mail.com",
        passwordConfirmation: "anypass"
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError("password"))
  })
  // devemos espionar o nosso metodo isvalid e nesse caso forçamos ele a falhar
  it("Should return 400 if invalid mail is provided", () =>{
    const {sut, emailValidatorStub} = makeSut()
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "invalidemail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass"
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError("email"))
  })
  it("Should call correctly EmailValidator", () =>{
    const {sut, emailValidatorStub} = makeSut()
    const validatorSpy =jest.spyOn(emailValidatorStub, "isValid")
    const httpRequest = {
      body: {
        name: "anyname@mail.com",
        email: "anymail@mail.com",
        password: "anypass",
        passwordConfirmation: "anypass"
      }
    }
    sut.handle(httpRequest)
    expect(validatorSpy).toHaveBeenCalledWith("anymail@mail.com")
  })
  
})