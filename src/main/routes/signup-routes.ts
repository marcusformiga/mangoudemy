import { Router } from "express";
import { adapterRoute } from "../adapters/express-adapter";
import { makeSignUpController } from "../factories/signup";


export default (router: Router) => {
  router.post("/signup", adapterRoute(makeSignUpController()))
}