import { MissingParamError } from "../../errors/missing-param-error"
import { RequiredFieldsValidation } from "./required-fields-validation"

const makeSut = (): RequiredFieldsValidation => {
  return new RequiredFieldsValidation('field')
}
describe('RequiredFieldsValidation', () => {
  it('Should return a MissingParam error if field is no provided', () => {
    const sut = makeSut()
    const error = sut.validate({ invalidField: "invalid" })
    expect(error).toEqual(new MissingParamError("field"))
  })
  it("Should return null is validations is succesds", () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'field'});
    expect(error).toBeFalsy()
  });
})
