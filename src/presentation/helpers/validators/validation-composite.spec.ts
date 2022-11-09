import { MissingParamError } from "../../errors/missing-param-error"
import { Validation } from "../../protocols/validation"
import { ValidationComposite } from "./validation-composite"

describe('ValidationComposite', () => {
  it('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
      validate(input: any): Error {
        return new MissingParamError('field')
      }
      
    }
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: "any_value" })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
