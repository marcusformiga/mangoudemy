import { ServerError } from "../errors/server-error";

export const badRequest = (err: Error) => {
  return {
    statusCode: 400,
    body: err
  }
}

export const serverError = () => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};