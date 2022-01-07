
export const badRequest = (err: Error) => {
  return {
    statusCode: 400,
    body: err
  }
}