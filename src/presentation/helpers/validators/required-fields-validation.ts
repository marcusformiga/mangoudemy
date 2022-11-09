import { MissingParamError } from "../../errors/missing-param-error";
import { Validation } from "../../protocols/validation";

export class RequiredFieldsValidation implements Validation {
  // pega um campo que vem do body e valida = verificar se dentro do input existe o campo
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
  
}