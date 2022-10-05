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

export const ok = (data) => {
  return {
    statusCode: 200,
    body: data
  }
}