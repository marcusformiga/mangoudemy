import { Encrypter } from "../../data/protocols/Encrypter";
import bcrypt from "bcryptjs"

export class BcryptAdapter implements Encrypter {

  constructor(private readonly salt: number){}
  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
  
}