import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper"
import { app } from "./config/app"
import env from "./config/env"

const port = 3001
MongoHelper.connect("mongodb://localhost:27018/clean-node-api")
  .then(() => {
    app.listen(port, () => console.log("server running"));
  })
  .catch((err) => {
    console.log(err);
  });
