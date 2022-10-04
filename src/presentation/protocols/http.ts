// protocols é a camada responsavel por juntar as interfaces referentes a camada de apresentacao (externa)


export interface HttpRequest {
  body?: any

}

export interface HttpResponse {
  statusCode: number
  body: any
}
