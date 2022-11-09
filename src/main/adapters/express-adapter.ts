import { Controller } from "../../presentation/protocols/controller";
import { Request, Response } from "express";
import { HttpRequest } from "../../presentation/protocols/http";

export const adapterRoute = (controller: Controller) => {
  return async (req: Request, resp: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    } 
    const htppResponse = await controller.handle(httpRequest)
    resp.status(htppResponse.statusCode).json(htppResponse.body)
  }
}