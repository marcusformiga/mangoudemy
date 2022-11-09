import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

export class LogControllerDecorator implements Controller {
  // injetar o log e fazer a logica interna
  constructor(private readonly controller: Controller) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    return httpResponse;
  }
}