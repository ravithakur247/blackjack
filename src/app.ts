import express, { Request, Response, NextFunction } from "express";
import routes from "./routes/routes";
import { CustomError } from "./models/Error/Error";
import { MongoHelper } from "./middleware/mongoClient";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/blackJack", routes);
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({ message: error.message });
  }
);
app.listen(8080, async () => {
  try {
    await MongoHelper.connect(
      `mongodb+srv://NodeApp:EodRqIjfPDipTXmk@cluster0-f7au8.mongodb.net/blackjack?retryWrites=true&w=majority`
    );
    console.info(`Connected to Mongo!`);
  } catch (err) {
    console.error(`Unable to connect to Mongo!`, err);
  }
});
