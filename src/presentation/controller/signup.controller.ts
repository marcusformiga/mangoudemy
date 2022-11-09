import { AddAcount } from "../../domain/usecases/add-account";
import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { ServerError } from "../errors/server-error";
import { badRequest, serverError, ok } from "../helpers/http";
import { Validation } from "../protocols/validation";
import { Controller } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";
// o controler nao deve ser responsavel pela logica de criar uma conta
// design pattern decorator no controller , o log nao faz parte das nossas regras de negocio
// a classe que vamos decorar tem que ser do mesmo tipo
// log de error nao sera add no meu caso
export class SignUpController implements Controller {
  constructor(
    private readonly addAcount: AddAcount,
  private readonly validation: Validation) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const {name, email, password, passwordConfirmation} = httpRequest.body
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }
      const account = await this.addAcount.add({
        name,
        email,
        password,
        passwordConfirmation
      })
      return ok(account)
    } catch (err) {
      console.log(err)
      return serverError()
    }
  }
}