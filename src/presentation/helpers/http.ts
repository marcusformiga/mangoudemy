import { ServerError } from "../errors/server-error";
import { Unauthorized } from "../errors/server-error copy";

export const badRequest = (err: Error) => {
  return {
    statusCode: 400,
    body: err
  }
}

export const unauthorized = () => {
  return {
    statusCode: 401,
    body: new Unauthorized(),
  };
};
export const serverError = () => {
  return {
    statusCode: 500,
    body: new ServerError(),
  };
};

export const ok = (data) => {
  return {
    statusCode: 200,
    body: data
  }
}