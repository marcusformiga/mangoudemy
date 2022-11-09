import request from "supertest"
import {app} from "../app"
// test do middleware integracao
describe("BodyParser middleware", () => {
  test("Body parser route", async() => {
    app.post("/test-body-parser", (req, resp) => {
      resp.send(req.body)
    })
    await request(app).post("/test-body-parser")
      .send({ name: "marcus" })
      .expect({name: "marcus"})
  })
})