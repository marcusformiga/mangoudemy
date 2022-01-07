import { SignUpController } from "./signup.controller"

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
    expect(httpResponse.body).toEqual(new Error("missing param: name"))
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
    expect(httpResponse.body).toEqual(new Error("missing param: email"))
  })
})