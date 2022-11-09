import { InvalidParamError } from "../../errors/invalid-param-error";
import { CompareFieldsValidation } from "./compare-fields-validation"

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation("field", "fieldToCompare");
}
describe("CompareFieldsValidation", () => {
  it("Should return a InvalidParam error if field is no provided", () => {
    const sut = makeSut();
    const error = sut.validate({
      field: "value",
      fieldToCompare: "wrong_value"
    });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });
  it("Should return null is validations is succesds", () => {
    const sut = makeSut();
     const error = sut.validate({
       field: "value",
       fieldToCompare: "value",
     });
    expect(error).toBeFalsy();
  });
});
