import { CompareFieldsValidation } from "../../presentation/helpers/validators/compare-fields-validation";
import { EmailValidation } from "../../presentation/helpers/validators/email-validation";
import { RequiredFieldsValidation } from "../../presentation/helpers/validators/required-fields-validation";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite"
import { EmailValidator } from "../../presentation/protocols/email-validator";
import { makeValidationComposite } from "./validation"
// nao tem o comporamento default

jest.mock("../../presentation/helpers/validators/validation-composite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
describe("ValidationCompositeFactory", () => {
  it("Should call ValidationComposite with all validations", () => {
    // devemos mockar o nosso validationComposite
    makeValidationComposite()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation("name"),
      new RequiredFieldsValidation("email"),
      new RequiredFieldsValidation("password"),
      new RequiredFieldsValidation("passwordConfirmation"),
      new CompareFieldsValidation("password", "passwordConfirmation"),
      new EmailValidation("email", makeEmailValidator()),
    ]);
  })
})