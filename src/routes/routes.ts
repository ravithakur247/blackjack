import { Router } from "express";
import {
  createPlayer,
  initiateGame,
  playerHandDraw,
  dealerHandDraw,
  playerHistory,
} from "../controller/controller";
const router = Router();
router.post("/createPlayer", createPlayer);
router.post("/startGame", initiateGame);
router.post("/playerDraw", playerHandDraw);
router.post("/dealerDraw", dealerHandDraw);
router.get("/playerHistory", playerHistory);
export default router;
