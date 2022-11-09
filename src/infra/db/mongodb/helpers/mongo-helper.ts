import { MongoClient } from "mongodb";


export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string) {
    this.client = await MongoClient.connect(uri);

  },
  async disconnect() {
    await this.client.close()
    // this.client = null

  },
  getCollection(name: string) {
    return this.client.db().collection(name)
  },
  mapper(collection: any) {
    // poodemos pasar para o mongoHelper
    const { _id, accountWithOutId } = collection;
    return Object.assign({}, accountWithOutId, { id: _id });
  }
}