import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { Validation } from "../../protocols/validation";

export class CompareFieldsValidation implements Validation {
  // pega um campo que vem do body e valida = verificar se dentro do input existe o campo
  constructor(private readonly fieldName: string, private readonly fieldToCompare: string) {}
  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare);
    }
  }
  
}