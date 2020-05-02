import { RequestHandler } from "express";
import { InternalServerError } from "../models/Error/Error";
import { JsonModel } from "../models/Result/JsonModel";
import { Message } from "../constant/message";
import {
  createUserService,
  initiateGameService,
  drawplayerHandService,
  drawdealerHandService,
  getPlayerHistoryService,
} from "../service/service";

export const createPlayer: RequestHandler = async (req, res, next) => {
  try {
    let name = req.body.name as string;
    let data = await createUserService(name);
    res.status(data.statusCode).json(new JsonModel(data, Message.SUCCESS));
  } catch (exceptions) {
    next(new InternalServerError());
  }
};
export const initiateGame: RequestHandler = async (req, res, next) => {
  try {
    let playerID = req.body.playerID as string;
    let data = await initiateGameService(playerID);
    res.status(data.statusCode).json(new JsonModel(data, Message.SUCCESS));
  } catch (exceptions) {
    next(new InternalServerError());
  }
};
export const playerHandDraw: RequestHandler = async (req, res, next) => {
  try {
    let roomId = req.body.roomId as string;
    let data = await drawplayerHandService(roomId);
    res.status(data.statusCode).json(new JsonModel(data, Message.SUCCESS));
  } catch (exceptions) {
    next(new InternalServerError());
  }
};

export const dealerHandDraw: RequestHandler = async (req, res, next) => {
  try {
    let roomId = req.body.roomId as string;
    let data = await drawdealerHandService(roomId);
    res.status(data.statusCode).json(new JsonModel(data, Message.SUCCESS));
  } catch (exceptions) {
    next(new InternalServerError());
  }
};

export const playerHistory: RequestHandler = async (req, res, next) => {
  try {
    let playerId = req.query.playerId as string;
    console.log(playerId);

    let data = await getPlayerHistoryService(playerId);
    res.status(data.statusCode).json(new JsonModel(data, Message.SUCCESS));
  } catch (exceptions) {
    next(new InternalServerError());
  }
};
