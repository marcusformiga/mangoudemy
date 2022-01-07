import { InvalidParamError } from "../errors/invalid-param-error";
import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/bad-request";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator){
    
  }
  handle(httpRequest: HttpRequest): HttpResponse{
    const requiredFields = ["name", "email", "password"]
    for(let field of requiredFields){
      if(!httpRequest.body[field]){
        return badRequest(new MissingParamError(field))
      }
    }
    const isValidMail = this.emailValidator.isValid(httpRequest.body.email)
    if(!isValidMail){
      return badRequest(new InvalidParamError("email"))
    }
  }
}