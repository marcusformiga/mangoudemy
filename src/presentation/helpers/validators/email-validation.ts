import { InvalidParamError } from "../../errors/invalid-param-error";
import { MissingParamError } from "../../errors/missing-param-error";
import { EmailValidator } from "../../protocols/email-validator";
import { Validation } from "../../protocols/validation";

export class EmailValidation implements Validation {
  // O email validation usa o emailValidator (lib externa)
  // pega um campo que vem do body e valida = verificar se dentro do input existe o campo
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}
  validate(input: any): Error {
    const isValidMail = this.emailValidator.isValid(input[this.fieldName]);
    if (!isValidMail) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
