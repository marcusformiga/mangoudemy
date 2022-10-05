import { AddAcount } from "../../domain/usecases/add-account";
import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { ServerError } from "../errors/server-error";
import { badRequest, serverError, ok } from "../helpers/http";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";
// o controler nao deve ser responsavel pela logica de criar uma conta
export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator,
  private readonly addAcount: AddAcount) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const {name, email, password, passwordConfirmation} = httpRequest.body
    try {
      const requiredFields = ["name", "email", "password", "passwordConfirmation"]
      for (let field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (passwordConfirmation !== password) {
        return badRequest(new InvalidParamError("passwordConfirmation"))
      }
 
      const isValidMail = this.emailValidator.isValid( email)
      if (!isValidMail) {
        return badRequest(new InvalidParamError("email"))
      }
      const account = await this.addAcount.add({
        name,
        email,
        password,
        passwordConfirmation
      })
      return ok(account)
    } catch (err) {
      return serverError()
    }
  }
}