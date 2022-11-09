import { DbAddAcount } from "../../data/usecase/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/cryptography/bcrypt-adapter";
import { AccountMongoRepo } from "../../infra/db/mongodb/account-repository/account";
import { SignUpController } from "../../presentation/controller/signup.controller";
import { ValidationComposite } from "../../presentation/helpers/validators/validation-composite";
import { Controller } from "../../presentation/protocols/controller";
import { LogControllerDecorator } from "../decorator/log-decorator";
import { makeValidationComposite } from "./validation";

// liskov substituion, add comportamento sem alterar a classe e open close principle em acao


export const makeSignUpController = (): Controller => {
  // devemos isolar a criacao do composite para manter ele testavel
  const bcryptAdapter = new BcryptAdapter(12)
  const mongoRepository = new AccountMongoRepo()
  const dbAddAcount = new DbAddAcount(bcryptAdapter, mongoRepository)
  const validationComposite = makeValidationComposite()
  const signupController = new SignUpController(dbAddAcount, validationComposite)
  return new LogControllerDecorator(signupController)
}