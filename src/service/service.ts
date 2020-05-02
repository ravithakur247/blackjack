import { getDB } from "../middleware/db";
import { IServerResponse } from "../interface/ServerResponse";
import { PlayerStatus } from "../constant/playerStatus";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../constant/message";
import { httpStatus } from "../constant/httpStatus";
import { IUser } from "../interface/User";
import { ICreateRoom } from "../interface/CreateRoom";
import { Pack } from "../Utility/cardPack";
import { roomStatus } from "../constant/roomStatus";
import { ICard } from "../interface/Card";
import { MongoHelper } from "../middleware/mongoClient";

export const createUserService = async (
  name: string
): Promise<IServerResponse> => {
  const db = getDB();
  let user: IUser = {
    playerId: uuidv4(),
    name: name,
    isBusy: false,
    status: PlayerStatus.ACTIVE,
  };
  let { insertedId } = await db.collection("user").insertOne(user);
  return {
    data: insertedId,
    message: Message.USER_CREATION_SUCCESS,
    statusCode: httpStatus.SUCCESS_CREATE,
  };
};
export const initiateGameService = async (
  playerId: string
): Promise<IServerResponse> => {
  let response: IServerResponse;

  const session = MongoHelper.client.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
      readPreference: "primary",
    },
  });

  const db = getDB();
  try {
    let player = await db
      .collection("user")
      .findOne({ playerId: playerId }, { fields: { _id: 0, isBusy: 1 } });
    console.log(player);
    if (player.isBusy) {
      return {
        data: [],
        message: Message.PLAYER_IS_BUSY,
        statusCode: httpStatus.UNAUTHORIZED,
      };
    }
    let deck: ICard[] = [...Pack, ...Pack, ...Pack].sort(
      () => Math.random() - 0.5
    );
    let roomId: string = uuidv4();
    let room: ICreateRoom = {
      roomId: roomId,
      deck: deck,
      playerId: playerId,
      playerHand: [],
      dealerHand: [],
      roomStatus: roomStatus.ACTIVE,
    };
    let { insertedId } = await db
      .collection("room")
      .insertOne(room, { session });

    await db
      .collection("user")
      .updateOne(
        { playerId: playerId },
        { $set: { isBusy: true } },
        { session }
      );
    response = {
      data: {
        roomId: roomId,
        insertId: insertedId,
        deck: deck,
      },
      message: Message.ROOM_CREATED_SUCCESS,
      statusCode: httpStatus.SUCCESS_CREATE,
    };
  } catch (exception) {
    response = {
      data: exception.message,
      message: Message.ROOM_CREATION_FAIL,
      statusCode: httpStatus.NOT_ALLOWED,
    };
  } finally {
    await session.endSession();
  }
  return response;
};

export const drawplayerHandService = async (
  roomId: string
): Promise<IServerResponse> => {
  const db = getDB();
  let card: any;
  let response: IServerResponse;

  const session = MongoHelper.client.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
      readPreference: "primary",
    },
  });
  try {
    card = await db.collection("room").findOne({ roomId: roomId });

    await db
      .collection("room")
      .updateOne({ roomId: roomId }, { $pop: { deck: -1 } }, { session });
    await db
      .collection("room")
      .updateOne(
        { roomId: roomId },
        { $push: { playerHand: card.deck[0] } },
        { session }
      );
    response = {
      data: card.deck[0],
      message: Message.CARD_DRAWN_SUCESS,
      statusCode: httpStatus.SUCCESS,
    };
  } catch (exception) {
    response = {
      data: exception.message,
      message: Message.CARD_DRAW_FAIL,
      statusCode: httpStatus.BAD_REQUEST,
    };
  } finally {
    await session.endSession();
  }
  return response;
};

export const drawdealerHandService = async (
  roomId: string
): Promise<IServerResponse> => {
  const db = getDB();
  let card: any;
  let response: IServerResponse;
  const session = MongoHelper.client.startSession({
    defaultTransactionOptions: {
      readConcern: { level: "local" },
      writeConcern: { w: "majority" },
      readPreference: "primary",
    },
  });
  try {
    let result = await db.collection("room").findOne({ roomId: roomId });
    card = result.deck[0];
    if (card.name === "Ace") {
      let dealerHandValue: number = result.dealerHand.reduce(
        (a: number, b: any) => a + b.value || 0,
        0
      );
      card.value = 17 - dealerHandValue > 11 ? 11 : 1;
    }
    await db
      .collection("room")
      .updateOne({ roomId: roomId }, { $pop: { deck: -1 } }, { session });
    await db
      .collection("room")
      .updateOne(
        { roomId: roomId },
        { $push: { dealerHand: card } },
        { session }
      );
    response = {
      data: card,
      message: Message.CARD_DRAWN_SUCESS,
      statusCode: httpStatus.SUCCESS,
    };
  } catch (exception) {
    response = {
      data: exception.message,
      message: Message.CARD_DRAW_FAIL,
      statusCode: httpStatus.BAD_REQUEST,
    };
  } finally {
    await session.endSession();
  }
  return response;
};

export const getPlayerHistoryService = async (
  playerId: string
): Promise<IServerResponse> => {
  const db = getDB();
  let data = await db
    .collection("room")
    .find(
      { playerId: playerId },
      { fields: { playerId: 1, playerHand: 1, roomId: 1, _id: 0 } }
    )
    .toArray();
  return {
    data: data,
    message: Message.PLAYER_HISTORY_FETCHED,
    statusCode: httpStatus.SUCCESS,
  };
};
