import { SignUpController } from "./signup.controller"
import {MissingParamError} from '../errors/missing-param-error'

describe("SignUpController", () =>{
  it("Should return 400 if no name has provided", () =>{
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
  it("Should return 400 if no password has provided", () =>{
    const sut = new SignUpController()
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
  
})