import { Authentication } from "../../domain/usecases/authentication";
import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { Unauthorized } from "../errors/server-error copy";
import { badRequest, ok, serverError, unauthorized } from "../helpers/http";
import { Validation } from "../protocols/validation";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";


export class LoginController implements Controller {
  constructor(private readonly authentication: Authentication, private readonly validation: Validation){}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({email, password});
      if (!accessToken) {
        return unauthorized()
      }
      return ok(accessToken)
    } catch (err) {
      return serverError()
    }
  }
  
}