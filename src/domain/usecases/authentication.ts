
export interface Authentication {
  auth(authentication: AuthenticationModel): Promise<AccessToken>
}

export type AccessToken = {
  token: string
}

export type AuthenticationModel = {
  email: string
  password: string
}