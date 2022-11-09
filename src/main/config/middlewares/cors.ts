import { Request, Response, NextFunction } from "express"


export const corsMiddleware = (req: Request, resp: Response, next: NextFunction) => {
  resp.set("access-control-allow-origin", "*");
  resp.set("access-control-allow-methods", "*");

    next();

}