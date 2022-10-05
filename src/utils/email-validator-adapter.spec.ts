import { EmailValidatorAdapter } from "./email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true
  }
}))

describe("EmailValidator", () => {
  test("Should returns false if email validator return false", () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false)
    const isValid = sut.isValid("invalidmail@mail.com")
    expect(isValid).toBeFalsy()
  })
  test("Should returns true if email validator return true", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("validmail@mail.com");
    expect(isValid).toBeTruthy();
  });
  test("Should call validator with correct email", () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, "isEmail")
    sut.isValid("validmail@mail.com");
    expect(isEmailSpy).toHaveBeenCalledWith("validmail@mail.com");
    expect(isEmailSpy).toHaveBeenCalled()
  });
})