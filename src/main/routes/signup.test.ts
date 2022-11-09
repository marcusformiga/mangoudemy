import { app } from "../config/app";
import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";

describe("SignUp Route", () => {
  beforeEach(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });
  // afeter all -> desconectar do banco
  afterEach(async () => {
    await MongoHelper.disconnect();
  });
  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  test("Should return an account on success", async () => {
       await request(app)
         .post("/api/signup")
         .send({
           name: "validName",
           email: "validmail@mail.com",
           password: "1234",
           passwordConfirmation: "1234"
         })
      .expect(200)
  });
});
