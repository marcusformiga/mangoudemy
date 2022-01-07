import { MissingParamError } from "../errors/missing-param-error";
import { badRequest } from "../helpers/bad-request";
import { Controller } from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse{
    const requiredFields = ["name", "email", "password"]
    for(let field of requiredFields){
      if(!httpRequest.body[field]){
        return badRequest(new MissingParamError(field))
      }
    }
  }
}