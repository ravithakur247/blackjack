import { MongoHelper } from "./mongoClient";

export const getDB = () => {
  return  MongoHelper.client.db('blackjack');
};

